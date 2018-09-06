import * as http from 'http';
import { Server } from 'ws';
import { Injectable, IConfigureServices, Injector, GuidDictonary } from "webhost";
import { ClientHost } from './clientHost';

@Injectable()
export class WebSocketService {

    public server: Server;
    public clients: GuidDictonary<ClientHost>

    public constructor(
        public injector: Injector
    ) {
        this.clients = new GuidDictonary<ClientHost>();
    }

    public configureWebSocket(services: IConfigureServices): void {
        this.startWebSocket(services.httpServer);
    }

    private startWebSocket(httpServer: http.Server): void {
        this.server = new Server({ server: httpServer });
        this.server.on('connection', this.connection.bind(this));
    }

    private connection(webSocket: WebSocket): void {
        let guid = this.clients.getFreeGuid();
        let clientHost = new ClientHost(guid, webSocket, this);
        this.clients.set(guid, clientHost);
    }
}