/// <reference path="../../typings/Index.d.ts" />

class ChatHub implements WebHost.WebSocket.IPath {
    public index: number;
    private _conn: WebHost.WebSocket.Connection;
    private _receiveDiv: HTMLDivElement;

    public create(connection: WebHost.WebSocket.Connection): void {
        this._conn = connection;
        this._receiveDiv = <HTMLDivElement>document.getElementById('receive');
    }

    public send(user: string, msg: string): void {
        this._conn.send(this.index, 'send', user, msg);
    }

    public receive(user: string, msg: string): void {
        let p = document.createElement('p');
        p.innerText = user + ': ' + msg;
        this._receiveDiv.appendChild(p);
    }
}

WebHost.WebSocket.paths.push({ path: 'Chat', item: ChatHub });
var host = window.document.location.host.replace(/:.*/, '');
var ws = WebHost.WebSocket.connect(host, 1338);

ws.ready(() => {

    var user = <HTMLInputElement>document.getElementById('user');
    var msg = <HTMLInputElement>document.getElementById('msg');
    var sender = <HTMLInputElement>document.getElementById('sender');

    var chat = ws.createPath<ChatHub>('Chat');

    sender.onclick = (ev) => {

        let userName = user.value;
        if (!userName) {
            alert('Must be have a name!');
            return;
        }

        let userMsg = msg.value;
        if (!userMsg) {
            alert('Must be a msg!');
            return;
        }

        chat.send(user.value, msg.value);
    };
});