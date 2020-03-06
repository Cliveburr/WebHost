import * as http from 'http';
import { ApplicationInstance, ModuleInstance, StaticProvider, IProvider, DefinedProvider } from 'providerjs';
import { Dictonary } from '../common/dictonary';
import { GuidDictonary } from '../common/guid.dictonary';
import { NotFound, DefaultFiles, StaticFiles, IPipelineType, IPipeline, IPipelineDelegate } from '../pipe';
import { HttpApplicationData } from './httpApplication.decorator';
import { Configure } from './configure';
import { IHttpApplication, IContext } from './httpApplication.data';
import { ConfigureServices } from './configureServices';
import { IDiagnostic, DIAGNOSTIC_LEVEL_PROVIDER, DIAGNOSTIC_PROVIDER, DiagnosticLevel } from '../diagnostic/diagnostic.data';
import { DefaultDiagnostic } from '../diagnostic/default.diagnostic';

export class HttpApplicationInstance extends ApplicationInstance {

    private httpServer: http.Server;
    private data: HttpApplicationData;
    private pipes: IPipelineType[];
    private serverValues: Dictonary<any>;
    private contexts: GuidDictonary<IContext>;
    private module: ModuleInstance;
    private diagnostic: IDiagnostic;

    constructor(
        cls: Object
    ) {
        super(cls);

        this.serverValues = new Dictonary<any>();
        this.contexts = new GuidDictonary<IContext>();
        this.module = (<any>cls).__module__;

        this.data = <HttpApplicationData>Reflect.getOwnMetadata('module:data', cls);

        this.setBasicPipes();
        this.setServerValues();
        this.diagnostic = this.setDiagnostic();
        this.httpServer = this.configureServices();
        this.pipes = this.configure();
        this.startServer();
    }

    private setBasicPipes(): void {
        let basicPipes = <IProvider[]>[
            new StaticProvider(NotFound),
            new StaticProvider(DefaultFiles),
            new StaticProvider(StaticFiles)
        ];
        this.module.container.providers?.push(...basicPipes);
    }
    
    private setServerValues(): void {
        this.serverValues.set('approot', this.data.approot);
        this.serverValues.set('wwwroot', this.data.wwwroot);
    }

    private setDiagnostic(): IDiagnostic {
        this.module.container.providers?.push(new DefinedProvider(DIAGNOSTIC_LEVEL_PROVIDER, this.data.diagnostic || DiagnosticLevel.Normal));
        let diagnostic = this.module.injector.getNotNeed(DIAGNOSTIC_PROVIDER);
        if (diagnostic) {
            return diagnostic;
        }
        else {
            return new DefaultDiagnostic(this.data.diagnostic || DiagnosticLevel.Normal)
        }
    }

    private configureServices(): http.Server {
        let httpServer = http.createServer(this.handleRequest.bind(this));
        let toConfigureServices = new ConfigureServices(this.serverValues, httpServer, this.module.injector);
        (<IHttpApplication>this.module.instance).configureServices(toConfigureServices);
        return httpServer;
    }

    private configure(): IPipelineType[] {
        let pipes = <IPipelineType[]>[];
        let toConfigure = new Configure(pipes);
        (<IHttpApplication>this.module.instance).configure(toConfigure);
        if (pipes.length == 0) {
            throw 'Need at least one pipe to process requests!';
        }
        return pipes;
    }

    private startServer(): void {
        this.httpServer.listen(this.data.port || 1338);
        this.logDiagnostic(`Server started: http://localhost:${(this.data.port || 1338).toString()}`);
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        let ctx: IContext = {
            guid: '',
            processed: false,
            request: req,
            response: res,
            serverValues: this.serverValues,
            values: new Dictonary<any>(),
            log: this.logDiagnostic.bind(this)
        };
        ctx.guid = this.contexts.autoSet(ctx);
        this.processPipe(ctx, 0);
    }

    private processPipe(ctx: IContext, index: number): void {
        try {
            let pipe = this.pipes[index];
            if (pipe && !ctx.processed) {
                if (pipe.prototype) {
                    let instance = this.module.injector.get(pipe) as IPipeline;
                    instance.process(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
                else {
                    (<IPipelineDelegate>pipe)(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
            }
            else {
                ctx.response.end();
                this.contexts.remove(ctx.guid);
            }
        }
        catch (err) {
            this.logDiagnostic(err, DiagnosticLevel.Error);
            ctx.response.statusCode = 500;
            ctx.response.write(JSON.stringify(err));
            ctx.response.end();
            this.contexts.remove(ctx.guid);
        }
    }

    private logDiagnostic(text: any, level?: DiagnosticLevel): void {
        this.diagnostic.log(text, level);
    }
}