import * as http from 'http';
import { Server } from 'ws';
import { Injectable, IConfigureServices, Injector, GuidDictonary } from "webhost";
import { ClientHost } from './ClientHost';

@Injectable()
export class WebSocketService {

    private webSocket: Server;
    public clients: GuidDictonary<ClientHost>

    public constructor(
        private injector: Injector
    ) {
        this.clients = new GuidDictonary<ClientHost>();
    }

    public configureWebSocket(services: IConfigureServices): void {
        this.startWebSocket(services.httpServer);
    }

    private startWebSocket(httpServer: http.Server): void {
        this.webSocket = new Server({ server: httpServer });
        this.webSocket.on('connection', this.connection.bind(this));
    }

    private connection(webSocket: WebSocket): void {
        debugger;
        let clientHost = this.injector.get(ClientHost) as ClientHost;
        let guid = this.clients.autoSet(clientHost);
        clientHost.connection(guid, webSocket);
    }
}