import { HostInjectable } from 'webhost-websocket';

@HostInjectable()
export class Session {
    private static count = 0;

    public id = Session.count++;
}