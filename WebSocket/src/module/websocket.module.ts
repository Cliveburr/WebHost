import { Module, AsRequestProvider } from "webhost";
import { WebSocketService } from "../services/websocket.service";
import { ClientHost } from '../services/ClientHost';

@Module({
    providers: [WebSocketService, new AsRequestProvider(ClientHost)],
    exports: [WebSocketService]
})
export class WebSocketModule {

}