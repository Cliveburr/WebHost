import { Injectable } from 'providerjs';
import { WS_SESSION_PROVIDER } from '../../src';

@Injectable({
    identity: WS_SESSION_PROVIDER
})
export class Session {
    private static count = 0;

    public id = Session.count++;
}