import { Identify, Injectable } from 'providerjs';
import { IPipeline, IContext, IDiagnostic, DiagnosticLevel } from 'webhost';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class Authentication implements IPipeline {

    public constructor(
        private service: AuthenticationService,
        @Identify('DIAGNOSTIC') private diagnostic: IDiagnostic
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
            .catch(err => {
                this.diagnostic.log(err, DiagnosticLevel.Error);
                ctx.response.writeHead(401);
                ctx.processed = true;
            })
            .finally(next);
    }
}
