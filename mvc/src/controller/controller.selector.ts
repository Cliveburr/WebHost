import * as urlService from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { IContext } from 'webhost';
import { IRouteInfo } from '../pipe/route.service';
import { Injectable, Injector, AsRequestProvider, Required } from 'providerjs';
import { HttpError } from '../pipe/mvc.pipe';

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

interface ITypeCache {
    type: Object;
    actions: { [key: string]: IActionCache };
}

interface IActionCache {
    methodName: string;
    argsName: string[];
}

@Injectable()
export class ControllerSelector {
    
    private ctrTypesCache: { [key: string]: ITypeCache };

    public constructor(
        private injector: Injector
    ) {
        this.ctrTypesCache = {};
    }

    private getType(ctx: IContext, route: IRouteInfo): ITypeCache | undefined {
        const controller = route.data['controller'];

        if (controller in this.ctrTypesCache) {
            return this.ctrTypesCache[controller];
        }

        const ctrPath = route.route.path ? route.route.path : 'controllers';
        const fullCtrPath = path.join(ctx.serverValues.get('approot'), ctrPath, controller + '.js');
        const ctrFile = path.resolve(fullCtrPath);

        if (!fs.existsSync(ctrFile)) {
            return undefined;
        }

        const ctrModule = require(ctrFile);
        const ctrType = ctrModule.default;
        if (!ctrType) {
            return undefined;
        }

        this.injector.providers.push(new AsRequestProvider(ctrType));
        this.ctrTypesCache[controller] = {
            type: ctrType,
            actions: {}
        };
        return this.ctrTypesCache[controller];
    }

    private getAction(action: string, typeCache: ITypeCache): IActionCache | undefined {
        const lowAction = action.toLowerCase();
        if (lowAction in typeCache.actions) {
            return typeCache.actions[lowAction];
        }

        const prototype = (<any>typeCache.type).prototype;
        const keys = Object.getOwnPropertyNames(prototype);
        for (let key of keys) {
            if (key.toLowerCase() === lowAction && typeof prototype[action] === "function") {
                typeCache.actions[lowAction] = {
                    methodName: key,
                    argsName: this.getArgs(prototype[key])
                };
                return typeCache.actions[lowAction];
            }
        }
        return undefined;
    }

    public async processRequest(ctx: IContext, route: IRouteInfo): Promise<HttpReponse> {
        const ctrCache = this.getType(ctx, route);
        if (!ctrCache) {
            throw new HttpError(404, `Controller for ${ctx.request.url} is missing!`);
        }

        const action = route.data['action'];
        if (typeof action == 'undefined') {
            throw new HttpError(404, `Invalid null action!`);
        }

        const actionCache = this.getAction(action, ctrCache);
        if (!actionCache) {
            throw new HttpError(405, `Method not allowed "${action}"!`);
        }

        const sessionProvider = ctx.values.get('sessionProvider');
        const controller = sessionProvider ?
            this.injector.get(ctrCache.type, sessionProvider)
            : this.injector.get(ctrCache.type);
        const method = controller[actionCache.methodName];

        const args = this.makeArgs(actionCache.argsName, ctx.request.url || '/');
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

    private makeArgs(argsNames: string[], url: string): any[] {
        const urlParsed = urlService.parse(url, true);
        const query = urlParsed.query;
        const args: any[] = [];
        for (let argName of argsNames) {
            if (argName in query) {
                args.push(query[argName]);
            }
            else {
                args.push(undefined);
            }
        }
        return args;
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
}
