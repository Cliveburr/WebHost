import { DefinedProvider } from 'webhost';
import { WebSocketService } from './websocket.service';
import { HostService } from './host.service';
import { paths } from '../path/path.decorator';

interface IMessage {
    path: string;
    method: string;
    args?: any[];
    request?: string;
    response?: string;
    value?: any;
}

interface IReturnStock {
    guid: string;
    execute: (value?: any) => void;
}

export class ClientHost {

    private paths: { [key: string]: any };
    private returnGuid: number;
    private returnStock: { [guid: string]: IReturnStock }

    public constructor(
        private guid: string,
        private webSocket: WebSocket,
        private webSocketService: WebSocketService
    ) {
        this.paths = {};
        this.returnGuid = 0;
        this.returnStock = {};
        this.connect();
    }

    private connect(): void {
        this.webSocket.onmessage = this.message.bind(this);
        this.webSocket.onclose = this.close.bind(this);
//         socket.on('error', (error: any) => this.onError.raise(this, error));
    }

    private getPath(path: string): any {
        let lowPath = path.toLowerCase();
        if (!this.paths[lowPath]) {
            let hostProvider = new DefinedProvider(HostService, new HostService(this, path));
            let cls = paths[lowPath];
            if (!cls) {
                throw 'Can\'t find the path: ' + path;
            }            
            this.paths[lowPath] = this.webSocketService.injector.create(cls, hostProvider);
        }
        return this.paths[lowPath];
    }

    private message(event: MessageEvent): void {
        
        let msg: IMessage = JSON.parse(event.data);
        if (msg.response) {
            let returnStock = this.returnStock[msg.response];
            if (!returnStock) {
                throw 'Internal Error! ReturnStock not found!';
            }
            delete this.returnStock[msg.response];
            returnStock.execute(msg.value);
        }
        else {
            let path = this.getPath(msg.path);

            if (!path[msg.method]) {
                throw `Invalid method: "${msg.method}" on path: "${msg.path}"!`;
            }

            let value = undefined;
            try {
                value = path[msg.method].apply(path, msg.args);
            }
            catch(err) {

            }

            if (msg.request) {
                let returnMsg: IMessage = {
                    method: msg.method,
                    path: msg.path,
                    response: msg.request,
                    value
                }
                this.webSocket.send(JSON.stringify(returnMsg));
            }
        }
    }

    public close(): void {
        this.webSocketService.clients.remove(this.guid);
        for (let path in this.paths) {
            delete this.paths[path];
        }
        delete this.paths;
        delete this.webSocketService;
    }

    public call(path: string, method: string, ...args: any[]): void {
        var m: IMessage = {
            path,
            method,
            args
        };
        this.webSocket.send(JSON.stringify(m));
    }

    public callr(path: string, method: string, ...args: any[]): Promise<any> {
        return new Promise((e, r) => {
            
            let newGuid = (this.returnGuid++).toString();
            let newReturnStock: IReturnStock = {
                guid: newGuid,
                execute: e
            }
            this.returnStock[newGuid] = newReturnStock;

            var m: IMessage = {
                path,
                method,
                args,
                request: newGuid
            };
            this.webSocket.send(JSON.stringify(m));
        });
    }

    public callAll(path: string, method: string, ...args: any[]): void {
        for (let client of this.webSocketService.clients.toList()) {
            client.call(path, method, ...args);
        }
    }
}