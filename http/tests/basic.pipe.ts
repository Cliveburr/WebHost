import { HttpApplication } from '../src/server/httpApplication.decorator';
import { IHttpApplication, IConfigureServices, IConfigure } from '../src/server/httpApplication.data';

@HttpApplication({
    port: 8081,
    timeout: 3000
})
export class BasicPipe implements IHttpApplication {
    
    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
    }

    private timeoutAsync(): Promise<void> {
        return new Promise<void>((e, r) => {
            setTimeout(e, 1000);
        });
    }

    public configure(app: IConfigure): void {
     
        // app.use((ctx, next) => {
        //     ctx.response.write('hit');
        //     next();
        // });

        app.use(async (ctx, next) => {
            ctx.response.write('before');

            await this.timeoutAsync();

            next();
        });


    }
}
