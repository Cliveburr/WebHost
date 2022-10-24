import { Injectable } from 'providerjs';
import { GuidDictonary, IContext } from 'webhost';
import { AuthenticationService, Identity } from '../../src';

export class IdentitySession extends Identity {
    public constructor(
        public sessionHeader: string,
        public index: number,
        public isAdmin: boolean
    ) {
        super();
    }
}

@Injectable()
export class SessionService extends AuthenticationService {

    private SESSION_HEADER = 'session-header';
    private store: GuidDictonary<IdentitySession>;
    private index: number;

    public constructor() {
        super();
        this.store = new GuidDictonary<IdentitySession>('asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789', 40);
        this.index = 1;
    }

    public async authenticate(ctx: IContext): Promise<Identity | undefined> {
        const headers = ctx.request.headers;
        if (this.SESSION_HEADER in headers) {
            const sessionHeader = <string>headers[this.SESSION_HEADER];
            return this.store.get(sessionHeader);
        }
        return undefined;
    }

    public login(admin: string): IdentitySession {
        const newId = this.store.getFreeGuid();
        const identity = new IdentitySession(newId, this.index++, admin === 'admin');
        this.store.set(newId, identity);
        return identity;
    }
}
export const SessionServiceProvider = AuthenticationService.providerFor(SessionService);
