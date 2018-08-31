import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, DefaultFiles, StaticFiles } from 'webhost';

@HttpApplication({
    imports: [],
    providers: [],
    port: 1800,
    wwwroot: __dirname + '/wwwroot'
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
    }

    public configure(app: IConfigure): void {
     
        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}