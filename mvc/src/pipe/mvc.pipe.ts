import * as urlService from 'url';
import { IPipeline, IContext } from 'webhost';
import { RouteService } from './route.service';
import { Injectable } from 'providerjs';
import { ControllerSelector, HttpReponse } from '../controller/controller.selector';
import { FormatterService } from '../formatter/formatter.service';

export class HttpError {
    public constructor(
        public code: number,
        public error?: string
    ) {
    }
}

@Injectable()
export class MvcPipe implements IPipeline {

    public constructor(
        private route: RouteService,
        private controllerSelector: ControllerSelector,
        private formatter: FormatterService
    ) {
    }

    public async process(ctx: IContext, next: () => void): Promise<void> {
        const urlParsed = urlService.parse(ctx.request.url || '/');
        const route = this.route.getRouteByUrl(urlParsed.pathname || '');
        if (route) {
            try {
                const result = await this.controllerSelector.processRequest(ctx, route);
                await this.processResult(ctx, result); 
            }
            catch (err) {
                if (err instanceof HttpError) {
                    await this.processResult(ctx, new HttpReponse(err.code, err.error));
                }
                else {
                    await this.processResult(ctx, new HttpReponse(500, err));
                }
            }
            ctx.processed = true;
            //     let cb = (result: IHttpResult) => {
            //         this.processResult(context, result, next);
            //     };

            //     let controller = context.inject<IController>(controllerType);
            //     controller.context = context;
            //     controller.response = cb;

            //     this.processController(context, controller, route, cb);
        }
        next();
    }

    private async processResult(ctx: IContext, response: HttpReponse): Promise<void> {
        if (response.data) {
            const accept = ctx.request.headers["accept"] || 'application/json';
            const serialized = await this.formatter.serialize(accept, response.data);
            ctx.response.writeHead(response.code, {
                'content-type': serialized.contentType,
                'content-length': serialized.serializedData.length
            });
            ctx.response.write(serialized.serializedData);
        }
        else {
            ctx.response.writeHead(response.code);
        }
    }
}