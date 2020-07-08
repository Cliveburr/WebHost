import * as http from 'http';
import * as ws from 'ws';
import { Injectable, Injector, Identify, Required } from 'providerjs';
import { IConfigureServices, GuidDictonary, DIAGNOSTIC_INSTANCE, IDiagnostic, DiagnosticLevel } from "webhost";
import { Host } from '../host/host';
import { WS_PATH_LOADER_PROVIDER, IPathLoader } from '../path/path.loader';
import { IPathData } from '../../shared/path.data';

export interface IPathStored {
    data: IPathData;
    target: Object;
    clientMethods?: string[];
}

@Injectable()
export class WebSocketService {

    public hosts: GuidDictonary<Host>;
    private server?: ws.Server;
    private paths: { [key: string]: IPathStored };

    public constructor(
        @Required() @Identify(WS_PATH_LOADER_PROVIDER) private pathLoader: IPathLoader,
        @Required() @Identify(DIAGNOSTIC_INSTANCE) public diagnostic: IDiagnostic,
        public injector: Injector
    ) {
        this.hosts = new GuidDictonary<Host>();
        this.paths = {};
    }

    public configureWebSocket(services: IConfigureServices): void {
        this.startWebSocket(services.httpServer);
    }

    private startWebSocket(httpServer: http.Server): void {
        this.server = new ws.Server({ server: httpServer });
        this.server.on('connection', this.connection.bind(this));
        this.server.on('error', this.error.bind(this));
    }

    private connection(webSocket: ws, request: http.IncomingMessage): void {
        const guid = this.hosts.getFreeGuid();
        const host = new Host(guid, webSocket, request, this);
        this.hosts.set(guid, host);
        this.diagnostic.log('WS Connection: ' + guid);
    }

    public disconnection(guid: string): void {
        this.hosts.remove(guid);
        this.diagnostic.log('WS Disconnection: ' + guid);
    }

    public error(error: Error): void {
        this.diagnostic.log(error, DiagnosticLevel.Error);
    }

    public getPath(path: string): IPathStored {
        if (!this.paths[path]) {
            const obj = this.pathLoader.getPath(path);
            if (!obj) {
                throw 'Can\'t find the path: ' + path;
            }

            const isPath = Reflect.getOwnMetadata('path:is', obj);
            if (!isPath) {
                throw 'Invalid path! ' + obj.toString();
            }

            const pathData = <IPathData>Reflect.getOwnMetadata('path:data', obj);
            if (path !== pathData.path) {
                throw 'Invalid path data for: ' + path;
            }
            this.paths[path] = {
                data: pathData,
                target: obj
            };
            if (pathData.client) {
                this.paths[path].clientMethods = this.extractMethods(pathData.client);
            }
        }
        return this.paths[path];
    }

    private extractMethods(target: any): string[] {
        const methods: string[] = [];
        const obj = new target();
        for (let method of Object.getOwnPropertyNames(obj.__proto__)) {
            switch (method) {
                case "constructor":
                    continue;
                default:
                    methods.push(method);
                }
        }
        return methods;
    }
}
