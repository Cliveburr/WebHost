var WebSocketServer = require('ws');
import * as path from 'path';
import * as fs from 'fs';
import * as webhost from 'webhost';
import * as Interface from '../IWebSocket';
import ClientHost from './ClientHost';

export function addServices(services: webhost.IConfigureServices, paths: Array<Interface.IPathItem>): void {
    services.add<WebSocketService>(WebSocketService);
    WebSocketService.instance.server = services.httpServer;
    WebSocketService.instance.paths = paths;
    WebSocketService.instance.start();
}

export class WebSocketService implements webhost.IServices {
    public static instance: WebSocketService;
    public server: webhost.IServer;
    public paths: Array<Interface.IPathItem>;
    public name: string;
    public type: webhost.ServicesType;
    public instances: WebSocketService;
    public clients: webhost.AutoDictonary<ClientHost>;

    private _server: any;

    constructor() {
        this.name = 'webSocket';
        this.type = webhost.ServicesType.Singleton;
        this.clients = new webhost.AutoDictonary<ClientHost>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 24);
        this.instances = this;
        WebSocketService.instance = this;
    }

    public getInstance(ctx: webhost.IContext): WebSocketService {
        return this.instances;
    }

    public start(): void {
        this._server = new WebSocketServer.Server({ server: this.server.httpServer });
        this._server.on('connection', this.connection.bind(this));
    }

    private connection(socket: any): void {
        let id = this.clients.generateID();
        let client = new ClientHost(id, socket);
        this.clients.set(id, client);
    }

    public sendAll(path: string, method: string, ...args: any[]): void {
        var clients = this.clients.toList();
        for (let i = 0, client: ClientHost; client = clients[i]; i++) {
            for (let p = 0, item: Interface.IPath; item = client.items[p]; p++) {
                if (item.name === path) {
                    client.send.apply(client, [item.index, method].concat(args));
                }
            }
        }
    }
}