import { IPipeline } from '../server/pipeline';
import { IRequestContext } from '../server/request.context';

export class NotFound implements IPipeline {
    
    public process(ctx: IRequestContext): Promise<void> {
        ctx.response.statusCode = 404;
        ctx.processed = true;
        return Promise.resolve();
    }
}