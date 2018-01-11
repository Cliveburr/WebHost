import { IConfigureServices, IServices, IServer, ServicesType, AutoDictonary, IContext } from 'webhost';
import { IPathItem, IPath } from '../IWebSocket';
import ClientHost from './ClientHost';

var WebSocketServer = require('ws');

export function addServices(services: IConfigureServices, paths: Array<IPathItem>): void {
    services.add<WebSocketService>(WebSocketService);
    WebSocketService.instance.server = services.httpServer;
    WebSocketService.instance.paths = paths;
    WebSocketService.instance.start();
}

export class WebSocketService implements IServices {
    public static instance: WebSocketService;
    public server: IServer;
    public paths: Array<IPathItem>;
    public name: string;
    public type: ServicesType;
    public instances: WebSocketService;
    public clients: AutoDictonary<ClientHost>;

    private webSocket: any;

    public constructor() {
        this.name = 'webSocket';
        this.type = ServicesType.Singleton;
        this.clients = new AutoDictonary<ClientHost>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 24);
        this.instances = this;
        WebSocketService.instance = this;
    }

    public getInstance(ctx: IContext): WebSocketService {
        return this.instances;
    }

    public start(): void {
        this.webSocket = new WebSocketServer.Server({ server: this.server.httpServer });
        this.webSocket.on('connection', this.connection.bind(this));
    }

    private connection(socket: any): void {
        let id = this.clients.generateID();
        let client = new ClientHost(id, socket);
        client.onError.add(this.onClientError.bind(this));
        this.clients.set(id, client);
    }

    public sendAll(path: string, method: string, ...args: any[]): void {
        var clients = this.clients.toList();
        for (let i = 0, client: ClientHost; client = clients[i]; i++) {
            for (let p = 0, item: IPath; item = client.items[p]; p++) {
                if (item.name === path) {
                    client.send.apply(client, [item.index, method].concat(args));
                }
            }
        }
    }

    private onClientError(sender: ClientHost, error: string): void {
        console.log(`WebSocket Error: \"${error}\" on client \"${sender.id}\"`)
    }
}