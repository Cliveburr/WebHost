import { Injectable, Required } from 'providerjs';
import { IPipeline, IContext } from 'webhost';
import { SessionStore } from './session.store';


@Injectable()
export class SessionPipe implements IPipeline {

    private SESSION_HEADER = 'session-id';

    public constructor(
        @Required() private store: SessionStore
    ) {
    }

    public process(ctx: IContext, next: () => void): void {
        const headers = ctx.request.headers;
        if (this.SESSION_HEADER in headers) {
            const session = <string>headers[this.SESSION_HEADER];
            const provider = this.store.getProvider(session);
            if (provider) {
                ctx.values.set('sessionProvider', provider);
            }
        }
        next();
    }
}
