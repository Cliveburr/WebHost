import { Module } from 'providerjs';
import { Path, CallbackPath } from '../../../../src';
import { ChatHub, IChatServer, IChatClient } from '../../shared/chat.interface';
import { Session } from '../session';

@Path(ChatHub)
export class ChatServerHub implements IChatServer {

    public constructor(
        private client: CallbackPath<IChatClient>,
        private session: Session
    ) {
        //setTimeout(this.callGetclient.bind(this), 3000);
        console.log('session id: ' + session.id.toString());
    }

    private async callGetclient(): Promise<void> {
        const client = await this.client.call.getclient();
        console.log('client: ' + client);
    }

    public sendMsg(user: string, msg: string): void {
        this.client.callAll.showMsg(user, msg);
    }

    public async logOnServer(): Promise<void> {
        console.log('hit on server');
    }

    public testServerError(): Promise<string> {
        throw 'error on server side'!
    }
}

@Module({
    providers: [ChatServerHub]
})
export class ChatModule {

}