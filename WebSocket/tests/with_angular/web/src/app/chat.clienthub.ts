import { Injectable } from '@angular/core';
import { ChatHub, IChatServer, IChatClient } from '../../../shared/chat.interface';
import { Path, ClientHub } from './websocket.module';

@Injectable()
@Path(ChatHub)
export class ChatClientHub extends ClientHub<IChatServer> implements IChatClient {
    
    public showMsg(user: string, msg: string): void {
    }

    public async getclient(): Promise<string> {
        const text = 'getclient: ' + navigator.platform;
        console.log(text)
        return text;
    }
}
