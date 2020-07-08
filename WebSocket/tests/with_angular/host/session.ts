import { Injectable } from 'providerjs';
import { SessionProvider } from '../../../src';

@Injectable()
export class Session {
    private static count = 0;

    public id = Session.count++;
}

export var ThisSessionProvider = new SessionProvider(Session);
