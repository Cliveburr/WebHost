import { HttpApplication, IHttpApplication, IConfigureServices, IConfigure, StaticFiles, DefaultFiles, NotFound, FileModule } from 'webhost';
import { MvcModule, Mvc, configureMvc, Authentication, SecurityModule } from '../src';
import { SessionServiceProvider } from './service/session-security.service';

@HttpApplication({
    imports: [MvcModule, FileModule, SecurityModule],
    providers: [SessionServiceProvider],
    exports: [SessionServiceProvider],
    port: 8081,
    approot: __dirname,
    wwwroot: __dirname + '\\..\\..\\tests\\wwwroot'
})
export class AllMvcTests implements IHttpApplication {
    
    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
        
        configureMvc(services, {
            routes: [{
                prefix: 'api'
            }]
        });
    }

    public configure(app: IConfigure): void {
     
        app.use(DefaultFiles);
        app.use(StaticFiles);

        app.use(Authentication);
        app.use(Mvc);

        app.use(NotFound);
    }
}
