import { IPipeline, IContext } from 'webhost';
import { parse } from 'url';

export class SpaPipe implements IPipeline {
     public process(ctx: IContext, next: () => void): void {
        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        let pathname = parse(ctx.request.url).pathname;
        if (!isAjax && pathname.indexOf('.') == -1) {
            ctx.request.url = '/index.html';
        } 
        next();
    }
}