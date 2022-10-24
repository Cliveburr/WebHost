import * as urlService from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { IContext } from 'webhost';
import { Injectable, Injector, AsRequestProvider, DefinedProvider } from 'providerjs';
import { IRouteInfo } from '../pipe/route.service';
import { HttpError } from '../pipe/mvc.pipe';
import { FormatterService } from '../formatter/formatter.service';
import { IAuthorizationEvent } from '../security/authorization.decorator';

export class HttpReponse {

    public constructor(
        public code: number,
        public data?: any
    ) {
    }

    public get isHttpResponse(): boolean {
        return true;
    }
}

interface IControllerCache {
    type: Object;
    actions: IActionCache[];
    authorization: boolean;
}

interface IActionCache {
    method: string;
    functionName: string;
    paths: IPathCache[];
    argsName: string[];
    authorization?: IAuthorizationEvent;
}

interface IPathCache {
    name: string;
    type: PathCacheType;
}

enum PathCacheType {
    fixed = 1,
    value = 2
}

export interface IActionData {
    path: string;
    method: string;
}

interface IActionInfo {
    action: IActionCache;
    values: { [name: string]: string };
}

@Injectable()
export class ControllerSelector {
    
    private ctrTypesCache: { [key: string]: IControllerCache };
    private varRegex: RegExp;

    public constructor(
        private injector: Injector,
        private formatter: FormatterService
    ) {
        this.ctrTypesCache = {};
        this.varRegex = /^\{(.*?)\}$/i;
    }

    private getController(ctx: IContext, route: IRouteInfo): IControllerCache | undefined {

        if (route.ctrName in this.ctrTypesCache) {
            return this.ctrTypesCache[route.ctrName];
        }

        const ctrPath = route.route.path || 'controllers';
        const fullCtrPath = path.join(ctx.serverValues.get('approot'), ctrPath, route.ctrName + '.js');
        const ctrFile = path.resolve(fullCtrPath);

        if (!fs.existsSync(ctrFile)) {
            return undefined;
        }

        const ctrModule = require(ctrFile);
        const ctrType = ctrModule.default;
        if (!ctrType) {
            return undefined;
        }

        const controllerIs = <boolean>Reflect.getMetadata('mvc:controller:is', ctrType);
        if (!controllerIs) {
            throw 'Invalid controller!';
        }

        const authorizationIs = <boolean>Reflect.getMetadata('mvc:authorization:is', ctrType);

        this.injector.providers.push(new AsRequestProvider(ctrType));
        this.ctrTypesCache[route.ctrName] = {
            type: ctrType,
            actions: this.buildActions(ctrType, route.ctrName),
            authorization: authorizationIs || false
        };
        return this.ctrTypesCache[route.ctrName];
    }

    private buildActions(ctrType: any, ctrName: string): IActionCache[] {
        const actions: IActionCache[] = [];
        const prototype = ctrType.prototype;
        const keys = Object.getOwnPropertyNames(prototype);
        for (let key of keys) {
            const mvcActionData = <IActionData>Reflect.getMetadata('mvc:action:data', prototype, key);
            if (mvcActionData) {

                const authorization = <IAuthorizationEvent>Reflect.getMetadata('mvc:authorization:event', prototype, key);

                const splitedPath = mvcActionData.path
                    .split('/')
                    .filter(f => f !== '');

                if (splitedPath.length < 1) {
                    throw `Wrong action path for function ${key} on controller ${ctrName}!`;
                }

                const paths = splitedPath
                    .map(p => {
                        const pTested = this.varRegex.exec(p);
                        if (pTested) {
                            return { name: pTested[1], type: PathCacheType.value };
                        }
                        else {
                            return { name: p, type: PathCacheType.fixed };
                        }
                    })

                actions.push({
                    method: mvcActionData.method,
                    functionName: key,
                    paths,
                    argsName: this.getArgs(prototype[key]),
                    authorization
                });
            }
        }
        return actions;
    }

    private getAction(ctrCache: IControllerCache, methodType: string | undefined, route: IRouteInfo): IActionInfo | undefined {
        for (const action of ctrCache.actions) {
            if (action.method == methodType) {
                var matchAction = this.matchAction(action, route);
                if (matchAction) {
                    return matchAction;
                }
            }
        }
        return undefined;
    }

    private matchAction(action: IActionCache, route: IRouteInfo): IActionInfo | undefined {

        const info: IActionInfo = {
            action,
            values: {}
        };
        for (let i = 0; i < action.paths.length; i++) {

            const actionPath = action.paths[i];
            const urlPath = route.urlPaths[i];

            switch (actionPath.type) {
                case PathCacheType.fixed: {
                    if (actionPath.name != urlPath) {
                        return undefined;
                    }
                    break;
                }
                case PathCacheType.value: {
                    info.values[actionPath.name] = urlPath;
                    break;
                }
                default: return undefined;
            }
        }
        return info;
    }

    public async processRequest(ctx: IContext, route: IRouteInfo): Promise<HttpReponse> {
        const ctrCache = this.getController(ctx, route);
        if (!ctrCache) {
            throw new HttpError(404, `Controller for ${ctx.request.url} is missing!`);
        }

        const methodType = ctx.request.method;
        const actionInfo = this.getAction(ctrCache, methodType, route);
        if (actionInfo === undefined) {
            throw new HttpError(404, `Invalid action!`);
        }

        const identity = ctx.values.get('identity');
        if (ctrCache.authorization) {
            let isAuthorizated = !!identity;

            if (actionInfo.action.authorization) {
                isAuthorizated = actionInfo.action.authorization(identity);
            }

            if (!isAuthorizated) {
                throw new HttpError(401, `Not Authorizated!`);
            }
        }

        let controller: any;
        if (identity) {
            const identityProto = identity.constructor;
            const customProviders = [new DefinedProvider(identityProto, identity)];
            controller = this.injector.get(ctrCache.type, true, customProviders);
        }
        else {
            controller = this.injector.get(ctrCache.type, true);
        }
        const method = controller[actionInfo.action.functionName];

        const args = this.makeArgs(actionInfo);
        if (methodType == 'POST') {
            var body = await this.getBody(ctx);
            args[args.length - 1] = body;
        }

        const retData = method.apply(controller, args);

        if (this.isPromise(retData)) {
            return new Promise<HttpReponse>(executor => {
                retData.then(value => {
                    executor(this.checkData(value));
                });
            });
        }
        else {
            return this.checkData(retData);
        }
    }

    private makeArgs(actionInfo: IActionInfo): any[] {
        return actionInfo.action.argsName
            .map(a => {
                if (a in actionInfo.values) {
                    return actionInfo.values[a];
                }
                else {
                    return undefined;
                }
            });
    }

    private getArgs(func: Function): string[] {  
        return (func + '')
          .replace(/[/][/].*$/mg,'') // strip single-line comments
          .replace(/\s+/g, '') // strip white space
          .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
          .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
          .replace(/=[^,]+/g, '') // strip any ES6 defaults  
          .split(',').filter(Boolean); // split & filter [""]
    } 

    private checkData(data: any): HttpReponse {
        if (data) {
            if (this.isHttpResponse(data)) {
                return data;
            }
            else {
                return new HttpReponse(200, data);
            }
        }
        else {
            return new HttpReponse(204);
        }
    }

    private isPromise(obj: any): obj is Promise<any> {
        return typeof obj?.then !== 'undefined';
    }

    private isHttpResponse(obj: any): obj is HttpReponse {
        return typeof obj?.isHttpResponse !== 'undefined' && obj.isHttpResponse;
    }

    private getBody(ctx: IContext): Promise<any> {
        const chunks: string[] = [];
        return new Promise((e, r) => {
            ctx.request.setEncoding('utf8');
            ctx.request.on('data', (chunk) => {
                chunks.push(chunk);
            });
            ctx.request.on('end', () => {
                this.formatter.deserialize(ctx.request.headers['content-type'], chunks.join(''))
                    .then(content => {
                        e(content);
                    })
                    .catch(err => r(err))
            });
            ctx.request.on('error', err => r(err));
        });
    }
}
