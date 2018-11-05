import { HostService, Path } from 'webhost-websocket';
import { Session } from './session';

@Path({
    name: 'chat'
})
export class ChatHub {

    public constructor(
        private host: HostService,
        private session: Session
    ) {
        setTimeout(() => {
            this.host.callr<string>('getclient')
                .then(d => console.log('client: ' + d));
        }, 3000);

        console.log('session id' + session.id.toString());
    }

    public send(user: string, msg: string): void {
        this.receive(user, msg);
    }

    public receive(user: string, msg: string): void {
        this.host.callAll('receive', user, msg);
    }
}