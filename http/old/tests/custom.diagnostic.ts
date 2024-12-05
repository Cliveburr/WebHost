import { Injectable, StaticProvider, Identify } from 'providerjs';
import { HttpApplication } from '../src/server/httpApplication.decorator';
import { IHttpApplication, IConfigureServices, IConfigure } from '../src/server/httpApplication.data';
import { IDiagnostic, DiagnosticLevel, DIAGNOSTIC, DIAGNOSTIC_LEVEL } from '../src/diagnostic/diagnostic.data';

@Injectable()
class CustomDiagnostic implements IDiagnostic {

    public constructor(
        @Identify(DIAGNOSTIC_LEVEL) private appDiagnosticLevel: DiagnosticLevel
    ) {
    }

    public log(text: any, level?: DiagnosticLevel): void {
        if ((level || DiagnosticLevel.Normal) <= this.appDiagnosticLevel) {
            if (level == DiagnosticLevel.Error) {
                console.error('Custom: ' + text);
            }
            else {
                console.log('Custom:' + text);
            }
        }
    }
}

const CustomDiagnosticProvider = new StaticProvider(DIAGNOSTIC, CustomDiagnostic);

@HttpApplication({
    providers: [CustomDiagnosticProvider],
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

    }
}