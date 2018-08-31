import { IPipeline } from './pipeline';
import { IContext } from '../server/context';
import { Injectable } from '../../provider/injectableDecorator';

@Injectable()
export class DefaultFiles implements IPipeline {
     
    public process(ctx: IContext, next: () => void): void {
        if (ctx.request.url == '/') {
            ctx.request.url = '/index.html';
        }
        next();
    }
}