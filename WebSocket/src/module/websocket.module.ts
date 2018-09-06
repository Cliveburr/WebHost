import { Module } from "webhost";
import { WebSocketService } from "../services/websocket.service";

@Module({
    providers: [WebSocketService],
    exports: [WebSocketService]
})
export class WebSocketModule {

}