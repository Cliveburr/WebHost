

export namespace WebHostWebSocket {

    export interface HostData {
        paths: Array<PathType | PathType[]>;
        provider?: (cls: Object) => any;
    }

    export class Host {
        
        private ws: WebSocket;
        private paths: { [path: string]: Path };
        private pathTypes: PathType[];
        private returnGuid: number;
        private returnStock: { [guid: string]: IReturnStock }

        public constructor(
            private data: HostData
        ) {
            this.pathTypes = [];
            this.addPathTypeRecur(data.paths);
            this.paths = {};
            this.returnGuid = 0;
            this.returnStock = {};
        }

        private addPathTypeRecur(paths: Array<PathType | PathType[]>): void {
            for (let path of paths) {
                if (Array.isArray(path)) {
                    this.addPathTypeRecur(path);
                }
                else {
                    this.pathTypes.push(path);
                }
            }
        }

        public connect(address?: string): Promise<null> {
            let fullAddress = 'ws://' + (address || window.document.location.host);

            return new Promise<null>((e, r) => {
                this.ws = new WebSocket(fullAddress);
                this.ws.onmessage = this.onmessage.bind(this);            
                this.ws.onopen = <any>e;
            });
        }

        private onmessage(event: MessageEvent): void {
            
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
                let path = this.getPathByName(msg.path);
        
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
                    this.ws.send(JSON.stringify(returnMsg));
                }
            }
        }

        public getPath<T extends Path>(path: { new(): T ;}): T {
            let pathName = (<any>path).path;
            
            if (!pathName) {
                throw 'Invalid path name for class: ' + path.toString();
            }

            return this.getPathByName(pathName);
        }

        private getPathByName(pathName: string): any {
            
            let hasPath = this.paths[pathName];
            if (!hasPath) {
                let pathType = this.pathTypes
                    .find(p => p.path == pathName);
                
                if (!pathType) {
                    throw `Class for path '${pathName}' not found!`;
                }

                hasPath = this.data.provider ?
                    this.data.provider(pathType) :
                    new pathType();
                hasPath.pathName = pathName;
                hasPath.host = this;
                this.paths[pathName] = hasPath;
            }

            return hasPath;
        }

        public send(message: IMessage): void {
            this.ws.send(JSON.stringify(message));
        }

        public sendr(message: IMessage): Promise<any> {
            return new Promise((e, r) => {

                let newGuid = (this.returnGuid++).toString();
                let newReturnStock: IReturnStock = {
                    guid: newGuid,
                    execute: e
                }
                this.returnStock[newGuid] = newReturnStock;

                message.request = newGuid;
                this.ws.send(JSON.stringify(message));
            });
        }
    }

    export interface PathType {
        path: string;
        new (): Path;
    }

    export interface IMessage {
        path: string;
        method: string;
        args?: any[];
        request?: string;
        response?: string;
        value?: any;
    }

    export interface IReturnStock {
        guid: string;
        execute: (value?: any) => void;
    }

    export class Path {

        public host: Host;
        public pathName: string;

        public call(method: string, ...args: any[]): void {
            this.host.send({
                path: this.pathName,
                method,
                args: args
            })
        }

        public callr<T>(method: string, ...args: any[]): Promise<T> {
            return this.host.sendr({
                path: this.pathName,
                method,
                args: args
            })
        }
    }
}