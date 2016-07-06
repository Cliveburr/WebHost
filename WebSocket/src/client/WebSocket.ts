
module WebHost.WebSocket {
    export interface IPath {
        index: number;
        create(connection: Connection): void;
    }

    export interface IPathType {
        new (): IPath;
    }

    export interface IPathItem {
        path: string;
        item: IPathType;
    }

    export interface IMessage {
        index: number;
        method: string;
        args: any[];
    }

    export var paths: Array<IPathItem> = [];

    export function connect(address?: string, port?: number): Connection {
        if (!address)
            address = window.document.location.host.replace(/:.*/, '');
        if (!port)
            port = 80;
        return new Connection('ws://' + address + ':' + port.toString())
            .connect();
    }

    export class Connection {
        private _ws: any;
        private _items: Array<IPath>;
        private _itemsCount: number;
        private _ready: boolean;
        private _onReady: Function;

        constructor(
            private _address: string) {
            this._ready = false;
            this._items = [];
            this._itemsCount = 0;
        }

        public connect(): Connection {
            this._ws = new window['WebSocket'](this._address);
            this._ws.onopen = this.open.bind(this);
            this._ws.onmessage = this.onmessage.bind(this);
            return this;
        }

        private open(): void {
            this._ready = true;
            if (this._onReady)
                this._onReady();
        }

        public ready(callBack: Function): void {
            if (this._ready)
                callBack();
            else
                this._onReady = callBack;
        }

        private findPathItem(path: string): IPathItem {
            for (let i = 0, p: IPathItem; p = paths[i]; i++) {
                if (p.path == path)
                    return p;
            }
            return null;
        }

        private findItem(index: number): IPath {
            for (let i = 0, p: IPath; p = this._items[i]; i++) {
                if (p.index == index)
                    return p;
            }
            return null;
        }

        public createPath<T extends IPath>(path: string): T {
            let p = this.findPathItem(path);

            if (!p)
                throw 'Path "' + path + '" not find!';

            var item = new p.item();
            item.index = this._itemsCount;
            item.create(this);
            this._itemsCount++;
            this._items.push(item);

            this.send(item.index, null, 'create_item', path);

            return <any>item;
        }

        public send(index: number, method: string, ...args: any[]): void {
            var m: IMessage = {
                index: index,
                method: method,
                args: args
            };
            this._ws.send(JSON.stringify(m));
        }

        private onmessage(data: any): void {
            let msg: IMessage = JSON.parse(data.data);

            let path = this.findItem(msg.index);

            if (!path)
                throw 'não tem esse path'; //TODO: ver oque fazer

            if (!path[msg.method])
                throw 'não tem esse methodo';

            path[msg.method].apply(path, msg.args);
        }
    }
}