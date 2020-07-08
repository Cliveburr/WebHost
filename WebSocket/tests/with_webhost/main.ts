import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles, IContext, FileModule } from 'webhost';
import { WebSocketService, WebSocketModule } from '../../src';
import { SimpleLoader } from './simple.loader';
import { Session } from './session';
import { ChatServerHub } from './hub/chathub';
import { RedirectFiles } from './redirect.files';

@HttpApplication({
    imports: [FileModule, WebSocketModule],
    providers: [SimpleLoader, Session, ChatServerHub, RedirectFiles],
    exports: [SimpleLoader, Session],
    port: 1800,
    wwwroot: __dirname
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
        app.use(RedirectFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}
