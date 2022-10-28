import { Injectable } from 'providerjs';
import { IPipeline, IContext } from 'webhost';
import { parse } from 'url';

@Injectable()
export class SpaPipe implements IPipeline {

     public process(ctx: IContext, next: () => void): void {
        
        let isAjax = ctx.request.headers['x-requested-with'] == 'XMLHttpRequest';
        let pathname = parse(ctx.request.url || '').pathname || '';
        if (!isAjax && pathname.indexOf('.') == -1) {
            let indexFile = ctx.serverValues.get('indexFile');
            ctx.request.url = '/' + indexFile;
        } 
        next();
    }
}