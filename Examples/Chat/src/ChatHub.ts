import * as websocket from 'webhost-websocket';

export default class ChatHub implements websocket.IPath {
    public index: number;
    private _client: websocket.IClientHost;

    public create(client: websocket.IClientHost): void {
        this._client = client;
    }

    public send(user: string, msg: string): void {
        this.receive(user, msg);
    }

    public receive(user: string, msg: string): void {
        this._client.sendAll(this.index, 'receive', user, msg);
    }
}