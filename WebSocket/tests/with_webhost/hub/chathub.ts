import { Module } from 'providerjs';
import { Path, CallbackPath } from '../../../src';
import { Session } from '../session';
import { ChatHub, IChatServer, IChatClient } from '../shared/chat.interface';

@Path(ChatHub)
export class ChatServerHub implements IChatServer {

    public constructor(
        private client: CallbackPath<IChatClient>,
        private session: Session
    ) {
        setTimeout(this.callGetclient.bind(this), 3000);
        console.log('session id' + session.id.toString());
    }

    private async callGetclient(): Promise<void> {
        const client = await this.client.call.getclient();
        console.log('client connected: ' + client);
    }

    public sendMsg(user: string, msg: string): void {
        this.client.callAll.showMsg(user, msg);
    }
}

@Module({
    imports: [ChatServerHub]
})
export class ChatModule {

}