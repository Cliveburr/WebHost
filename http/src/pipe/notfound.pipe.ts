import { Injectable } from 'providerjs';
import { IPipeline } from './pipeline';
import { IContext } from '../server/httpApplication.data';

@Injectable()
export class NotFound implements IPipeline {
    
    public process(ctx: IContext, next: () => void): void {
        ctx.response.statusCode = 404;
        ctx.processed = true;
        next();
    }
}