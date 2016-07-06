import * as Interface from '../IWebSocket';
import { WebSocketService } from './WebSocket';

export default class ClientHost {
    public items: Array<Interface.IPath>;

    constructor(
        public id: string,
        private _socket: any) {
        this.items = [];
        _socket.on('message', this.message.bind(this));
        _socket.on('close', this.close.bind(this));
    }

    private findItem(index: number): Interface.IPath {
        for (let i = 0, p: Interface.IPath; p = this.items[i]; i++) {
            if (p.index == index)
                return p;
        }
        return null;
    }

    public findPathItem(path: string): Interface.IPathItem {
        for (let i = 0, p: Interface.IPathItem; p = WebSocketService.instance.paths[i]; i++) {
            if (p.path == path)
                return p;
        }
        return null;
    }

    private message(data: string): void {
        let msg: Interface.IMessage = JSON.parse(data);
        if (!msg.method && msg.args[0] === 'create_item') {
            let pathType = this.findPathItem(msg.args[1]);

            if (!pathType)
                throw 'não tem esse path type'; //TODO: ver oque fazer

            let path = new pathType.item();
            path.index = msg.index;
            path.name = msg.args[1];
            path.create(this);
            this.items.push(path);
        }
        else {
            let path = this.findItem(msg.index);

            if (!path)
                throw 'não tem esse path'; //TODO: ver oque fazer

            if (!path[msg.method])
                throw 'não tem esse methodo';

            path[msg.method].apply(path, msg.args);
        }
    }

    public close(): void {
        WebSocketService.instance.clients.remove(this.id);
    }

    public send(index: number, method: string, ...args: any[]): void {
        var m: Interface.IMessage = {
            index: index,
            method: method,
            args: args
        };
        this._socket.send(JSON.stringify(m));
    }

    public sendAll(index: number, method: string, ...args: any[]): void {
        let path = this.findItem(index);

        if (!path)
            throw 'não tem esse path'; //TODO: ver oque fazer

        WebSocketService.instance.sendAll.apply(WebSocketService.instance, [path.name, method].concat(args));
    }
}