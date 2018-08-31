import { IPipeline } from './pipeline';
import { IContext } from '../server/context';
import { Injectable } from '../../provider/injectableDecorator';

@Injectable()
export class Debug implements IPipeline {

    public process(context: IContext, next: () => void): void {
        debugger;
        next();
    }
}