import { Injectable } from 'providerjs';
import { IPipeline } from '../server/pipeline';
import { IContext } from '../server/httpApplication.data';

@Injectable()
export class DefaultFiles implements IPipeline {
     
    public process(ctx: IContext, next: () => void): void {
        if (ctx.request.url == '/') {
            ctx.request.url = '/index.html';
        }
        next();
    }
}