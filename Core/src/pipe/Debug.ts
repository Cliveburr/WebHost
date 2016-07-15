import * as IHttp from '../http/IHttp';

export class Debug implements IHttp.IPipeline {
    public process(context: IHttp.IContext, next: () => void): void {
        debugger;
        next();
    }
}