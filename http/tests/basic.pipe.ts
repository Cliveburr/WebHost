import { HttpApplication } from '../src/server/httpApplication.decorator';
import { IHttpApplication, IConfigureServices, IConfigure } from '../src/server/httpApplication.data';

@HttpApplication({
    port: 8081
})
export class BasicPipe implements IHttpApplication {
    
    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
    }

    public configure(app: IConfigure): void {
     
        app.use((ctx, next) => {
            ctx.response.write('hit');
            next();
        });

        app.useErrorNotFound();
    }
}