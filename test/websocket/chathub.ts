import { Injectable } from 'webhost';

@Injectable()
export class ChatHub {
    public index: number;
    // private client: IClientHost;

    // public create(client: IClientHost): void {
    //     this.client = client;
    // }

    public send(user: string, msg: string): void {
        //this.receive(user, msg);
    }

    public receive(user: string, msg: string): void {
        //this.client.sendAll(this.index, 'receive', user, msg);
    }
}