import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, DefaultFiles, StaticFiles, IContext } from 'webhost';
import { WebSocketModule, WebSocketService } from 'webhost-websocket';

import { ChatHub } from './chathub';
import { Session } from './session';

@HttpApplication({
    imports: [WebSocketModule],
    providers: [ChatHub, Session],
    port: 1800,
    wwwroot: __dirname + '/wwwroot'
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
        private webSocketService: WebSocketService
    ) {
    }

    public configureServices(services: IConfigureServices): void {

        this.webSocketService.configureWebSocket(services);
    }

    public configure(app: IConfigure): void {
     
        app.use((ctx: IContext, next: () => void) => {
            if (ctx.request.url && ctx.request.url.startsWith('/node_modules/')) {
                ctx.request.url = '../../..' + ctx.request.url;
            }
            next();
        });

        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}