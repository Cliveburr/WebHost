import { Injectable } from 'providerjs';
import { IPipeline, IContext } from 'webhost';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class Authentication implements IPipeline {

    public constructor(
        private service: AuthenticationService
    ) {
        if (!service) {
            throw 'Need inject AuthenticationService to use security!';
        }
    }

    public process(ctx: IContext, next: () => void): void {
        this.service.authenticate(ctx)
            .then(i => {
                ctx.values.set('identity', i);
            })
            .finally(next);
    }
}
