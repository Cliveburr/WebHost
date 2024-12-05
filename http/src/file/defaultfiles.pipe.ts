import { IPipeline } from '../server/pipeline';
import { IRequestContext } from '../server/request.context';

export class DefaultFiles implements IPipeline {
     
    public process(ctx: IRequestContext): Promise<void> {
        if (ctx.request.url == '/') {
            ctx.request.url = '/index.html';
        }
        return Promise.resolve();
    }
}