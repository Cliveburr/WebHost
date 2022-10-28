import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles, FileModule, DefaultFiles, DiagnosticLevel } from 'webhost';
import { WebSocketService, WebSocketModule } from '../../../src';
import { SimpleLoader } from './simple.loader';
import { ThisSessionProvider } from './session';

@HttpApplication({
    imports: [FileModule, WebSocketModule],
    providers: [SimpleLoader, ThisSessionProvider],
    exports: [SimpleLoader, ThisSessionProvider],
    port: 1800,
    wwwroot: __dirname,
    diagnostic: DiagnosticLevel.Normal
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
        private webSocketService: WebSocketService,
    ) {
    }

    public configureServices(services: IConfigureServices): void {
        this.webSocketService.configureWebSocket(services);
    }

    public configure(app: IConfigure): void {
        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}
