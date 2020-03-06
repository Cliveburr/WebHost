import * as path from 'path';
import * as fs from 'fs';
import { IContext } from 'webhost';
import { IRouteInfo } from '../pipe/route.service';
import { Injectable, Injector, IProviderContainer, AsRequestProvider, Required } from 'providerjs';
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

@Injectable()
export class ControllerSelector {
    
    private ctrTypesCache: { [key: string]: Object };
    private providersContainer: IProviderContainer

    public constructor(
        @Required() private injector: Injector
    ) {
        this.ctrTypesCache = {};
        this.providersContainer = {
            providers: []
        };
    }

    private getType(ctx: IContext, route: IRouteInfo): Object | undefined {
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

        this.providersContainer.providers?.push(new AsRequestProvider(ctrType));
        this.ctrTypesCache[controller] = ctrType;
        return ctrType;
    }

    public async processRequest(ctx: IContext, route: IRouteInfo): Promise<HttpReponse> {
        const ctrType = this.getType(ctx, route);
        if (!ctrType) {
            throw new HttpError(404, `Controller for ${ctx.request.url} is missing!`);
        }

        const controller = this.injector.get(ctrType, this.providersContainer);

        if (!('action' in route.data)) {
            throw new HttpError(404, `Invalid null action!`);
        }

        let method: Function | null  = null;
        let action = route.data['action']

        if (action) {
            let lowAction = action.toLowerCase();
            const keys = Object.getOwnPropertyNames((<any>ctrType).prototype);
            for (let key of keys) {
                if (key.toLowerCase() === lowAction && typeof controller[action] === "function") {
                    method = controller[key];
                    break;
                }
            }
        }

        if (!method) {
            action = ctx.request.method?.toLowerCase() || '';
            if (typeof controller[action] === "function") {
                method = controller[action];
            }
        }

        if (!method) {
            throw new HttpError(405, `Method not allowed "${action}"!`);
        }

        const tt = Reflect.getOwnMetadataKeys(ctrType);
        const ttt = Reflect.getMetadataKeys(ctrType);
        const args = (Reflect.getOwnMetadata('design:paramtypes', method) || []) as any[];
        const retData = method.apply(controller);

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




    //         let query = url.parse(context.request.url, true).query;
    //         let ret = method.apply(controller, [{
    //             queryString: query,
    //             routeData: route.data
    //         }]);
    //         if (ret) {
    //             callBack(ret);
    //         }
    //     } catch (e) {
    //         callBack(new results.InternalErrorResult(e));
    //     }
    // }
}