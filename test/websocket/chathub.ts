import { HostService, Path } from 'webhost-websocket';

@Path({
    name: 'chat'
})
export class ChatHub {

    public constructor(
        private host: HostService
    ) {
        setTimeout(() => {
            this.host.callr<string>('getclient')
                .then(d => console.log('client: ' + d));
        }, 3000);
    }

    public send(user: string, msg: string): void {
        this.receive(user, msg);
    }

    public receive(user: string, msg: string): void {
        this.host.callAll('receive', user, msg);
    }
}