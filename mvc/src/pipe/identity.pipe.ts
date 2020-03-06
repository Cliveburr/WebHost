import { Injectable } from 'providerjs';
import { IPipeline, IContext } from 'webhost';


@Injectable()
export class IdentityPipe implements IPipeline {

    public process(ctx: IContext, next: () => void): void {
        next();
    }
}
