import { Module } from "providerjs";
import { WebSocketService } from "./websocket.service";

@Module({
    providers: [WebSocketService],
    exports: [WebSocketService]
})
export class WebSocketModule {

}