import * as url from 'url';
import * as webhost from 'webhost';
import * as route from '../services/Route';
import { ControllerSelector } from '../services/ControllerSelector';
import { FormatterService } from '../services/Formatter';
import { IController, IHttpResult, IArguments } from '../IApi';
import * as results from '../Results';

export class Api implements webhost.IPipeline {
    public static $inject = ['route', 'controllerSelector', 'formatter'];

    constructor(
        private _route: route.RouteService,
        private _controllerSelector: ControllerSelector,
        private _formatter: FormatterService
    ) {
    }

    public process(context: webhost.IContext, next: () => void): void {
        let pathname = url.parse(context.request.url).pathname;
        let route = this._route.getRouteByUrl(pathname);
        if (route) {
            let controllerType = this._controllerSelector.getType(context, route);
            if (controllerType) {
                let cb = (result: IHttpResult) => {
                    this.processResult(context, result, next);
                };

                let controller = context.inject<IController>(controllerType);
                controller.context = context;
                controller.response = cb;

                this.processController(context, controller, route, cb);
            }
        }
        else {
            next();
        }
    }

    private processController(context: webhost.IContext, controller: IController, route: route.RouteInfo, callBack: (result: IHttpResult) => void): void {
        try {
            let method: Function = null;
            let action = route.getData('action');

            if (action) {
                let lowAction = action.toLowerCase();
                for (var key in this) {
                    if (key.toLowerCase() === action && typeof controller[action] === "function") {
                        method = controller[action];
                        break;
                    }
                }
            }

            if (!method) {
                action = context.request.method.toLowerCase();
                if (typeof controller[action] === "function") {
                    method = controller[action];
                }
            }

            if (!method) {
                callBack(new results.NotAllowedResult(`Method not allowed "${action}"!`));
            }

            let query = url.parse(context.request.url, true).query;
            let ret = method.apply(controller, [{
                queryString: query,
                routeData: route.data
            }]);
            if (ret) {
                callBack(ret);
            }
        } catch (e) {
            callBack(new results.InternalErrorResult(e));
        }
    }

    private processResult(context: webhost.IContext, result: IHttpResult, next: () => void): void {
        try{
            if (result.data) {
                let accept = context.request.headers["accept"];
                this._formatter.serialize(accept, result.data, (responseData, contentType) => {
                    context.response.writeHead(result.responseCode, {
                        'content-type': contentType,
                        'content-length': responseData.length
                    });
                    context.response.write(responseData);
                    context.alreadyProcess = true;
                    next();
                });
            }
            else {
                context.response.writeHead(result.responseCode);
                context.alreadyProcess = true;
                next();
            }
        } catch (e) {
            context.response.writeHead(500);
            context.response.write(JSON.stringify(e));
            context.alreadyProcess = true;
            next();
        }
    }
} 