import { HttpApplication, IHttpApplication, IConfigureServices, IConfigure, StaticFiles, DefaultFiles } from 'webhost';
import { MvcModule } from '../src/module/mvc.module';
import { MvcPipe } from '../src/pipe/mvc.pipe';
import { configureMvc } from '../src/module/configure';
import { IdentityPipe } from '../src/pipe/identity.pipe';

@HttpApplication({
    imports: [MvcModule],
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
                name: 'mainRoute',
                pattern: 'api/{controller}/{action}',
                defaults: {
                    'controller': 'home',
                    'action': 'home'
                }
            }]
        });
    }

    public configure(app: IConfigure): void {
     
        // app.use((ctx, next) => {
        //     console.debug();
        //     next();
        // });

        app.use(IdentityPipe);

        app.use(MvcPipe);

        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.useErrorNotFound();
    }
}
