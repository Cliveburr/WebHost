import { IProvider, DefinedProvider, Injectable } from 'providerjs';
import { Session } from './session';
import { GuidDictonary } from 'webhost';

interface IStore {
    sessionId: string;
    provider: DefinedProvider;
}

@Injectable()
export class SessionStore {

    private store: GuidDictonary<IStore>;

    public constructor() {
        this.store = new GuidDictonary<IStore>('asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789', 40);
    }

    public createNew<T>(): Session<T> {
        const newId = this.store.getFreeGuid();
        const session = new Session<T>(newId);
        const store: IStore = {
            sessionId: newId,
            provider: new DefinedProvider(Session, session)
        }
        this.store.set(newId, store);
        return session;
    }

    public get<T>(sessionId: string): Session<T> | undefined {
        return this.getProvider(sessionId)?.instance;
    }

    public getProvider(sessionId: string): DefinedProvider | undefined {
        return this.store.get(sessionId)?.provider;
    }

    public remove(sessionId: string): boolean {
        return this.store.remove(sessionId);
    }
}
