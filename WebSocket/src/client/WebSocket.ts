
export namespace client {


    export class Test {
        public value = 'aaa';
    }

}

export namespace WebHost.WebSocket {
    export interface IPath {
        index: number;
        //create(connection: Connection): void;
        [method: string]: any;
    }

    // export interface IPathType {
    //     new (): IPath;
    // }

    // export interface IPathItem {
    //     path: string;
    //     item: IPathType;
    // }

    // export interface IMessage {
    //     index: number;
    //     method: string;
    //     args: any[];
    // }

    // export var paths: Array<IPathItem> = [];

    // export function connect(address?: string, port?: number): Connection {
    //     if (!address)
    //         address = window.document.location.host.replace(/:.*/, '');
    //     if (!port)
    //         port = 80;
    //     return new Connection('ws://' + address + ':' + port.toString())
    //         .connect();
    // }

    // export class Connection {
    //     private ws: any;
    //     private items: Array<IPath>;
    //     private itemsCount: number;
    //     private isReady: boolean;
    //     private onReady: Function;

    //     constructor(
    //         private _address: string) {
    //         this.isReady = false;
    //         this.items = [];
    //         this.itemsCount = 0;
    //     }

    //     public connect(): Connection {
    //         this.ws = new (<any>window)['WebSocket'](this._address);
    //         this.ws.onopen = this.open.bind(this);
    //         this.ws.onmessage = this.onmessage.bind(this);
    //         return this;
    //     }

    //     private open(): void {
    //         this.isReady = true;
    //         if (this.onReady)
    //             this.onReady();
    //     }

    //     public ready(callBack: Function): void {
    //         if (this.isReady)
    //             callBack();
    //         else
    //             this.onReady = callBack;
    //     }

    //     private findPathItem(path: string): IPathItem {
    //         let find = paths.filter(p => p.path == path);
    //         return find && find[0] ? find[0] : null;
    //     }

    //     private findItem(index: number): IPath {
    //         let find = this.items.filter(i => i.index == index);
    //         return find && find[0] ? find[0] : null;
    //     }

    //     public createPath<T extends IPath>(path: string): T {
    //         let p = this.findPathItem(path);

    //         if (!p)
    //             throw 'Path "' + path + '" not find!';

    //         var item = new p.item();
    //         item.index = this.itemsCount;
    //         item.create(this);
    //         this.itemsCount++;
    //         this.items.push(item);

    //         this.send(item.index, null, 'create_item', path);

    //         return <any>item;
    //     }

    //     public send(index: number, method: string, ...args: any[]): void {
    //         var m: IMessage = {
    //             index: index,
    //             method: method,
    //             args: args
    //         };
    //         this.ws.send(JSON.stringify(m));
    //     }

    //     private onmessage(data: any): void {
    //         let msg: IMessage = JSON.parse(data.data);

    //         let path = this.findItem(msg.index);

    //         if (!path) {
    //             console.error(`Invalid path: \"${path}\"!`);
    //             return;
    //         }

    //         if (!path[msg.method]) {
    //             console.error(`Invalid method: \"${msg.method}\" on path: \"${path}\"!`);
    //             return;
    //         }

    //         path[msg.method].apply(path, msg.args);
    //     }
    // }
}