import { IPipeline } from './pipeline';
import { IContext } from '../server/context';
import { Injectable } from '../../provider/injectableDecorator';

@Injectable()
export class NotFound implements IPipeline {
    
    public process(ctx: IContext, next: () => void): void {
        ctx.response.statusCode = 404;
        next();
    }
}