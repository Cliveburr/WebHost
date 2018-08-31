import { Injectable } from 'webhost';

// import { Event } from 'webhost';
// import { IPath, IPathItem, IMessage } from '../IWebSocket';
// import { WebSocketService } from './WebSocket';

@Injectable()
export class ClientHost {

    public guid: string;
    public webSocket: WebSocket;
//     public items: Array<IPath>;
//     public onError: Event<(sender: ClientHost, error: string) => void>;

    public constructor(
//         public id: string,
//         private socket: any
    ) {
//         this.items = [];
//         this.onError = new Event();
//         socket.on('message', this.message.bind(this));
//         socket.on('close', this.close.bind(this));
//         socket.on('error', (error: any) => this.onError.raise(this, error));
    }

    public connection(guid: string, webSocket: WebSocket): void {
        this.guid = guid;
        this.webSocket = webSocket;
    }

//     private findItem(index: number): IPath {
//         let find = this.items.filter(i => i.index == index);
//         return find && find[0] ? find[0] : null;
//     }

//     public findPathItem(path: string): IPathItem {
//         let find = WebSocketService.instance.paths.filter(p => p.path == path);
//         return find && find[0] ? find[0] : null;
//     }

//     private message(data: string): void {
//         let msg: IMessage = JSON.parse(data);

//         if (!msg.method && msg.args[0] === 'create_item') {
//             let pathType = this.findPathItem(msg.args[1]);

//             if (!pathType) {
//                 this.onError.raise(this, `Invalid path: ${pathType}!`);
//                 return;
//             }

//             let path = new pathType.item();
//             path.index = msg.index;
//             path.name = msg.args[1];
//             path.create(this);
//             this.items.push(path);
//         }
//         else {
//             let path = this.findItem(msg.index);

//             if (!path) {
//                 this.onError.raise(this, `Invalid path: ${path}!`);
//                 return;
//             }

//             if (!path[msg.method]) {
//                 this.onError.raise(this, `Invalid path type: ${msg.method}!`);
//                 return;
//             }

//             path[msg.method].apply(path, msg.args);
//         }
//     }

//     public close(): void {
//         WebSocketService.instance.clients.remove(this.id);
//     }

//     public send(index: number, method: string, ...args: any[]): void {
//         var m: IMessage = {
//             index: index,
//             method: method,
//             args: args
//         };
//         this.socket.send(JSON.stringify(m));
//     }

//     public sendAll(index: number, method: string, ...args: any[]): void {
//         let path = this.findItem(index);

//         if (!path) {
//             this.onError.raise(this, `Invalid path: ${path}!`);
//             return;
//         }

//         WebSocketService.instance.sendAll.apply(WebSocketService.instance, [path.name, method].concat(args));
//     }
}