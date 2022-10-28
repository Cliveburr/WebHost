import { HttpApplication } from '../src/server/httpApplication.decorator';
import { IHttpApplication, IConfigureServices, IConfigure } from '../src/server/httpApplication.data';
import { FileModule, DefaultFiles, StaticFiles, NotFound } from '../src';

@HttpApplication({
    imports: [FileModule],
    port: 8081,
    wwwroot: __dirname + '\\..\\..\\tests\\wwwroot'
})
export class StaticPipe implements IHttpApplication {
    
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
