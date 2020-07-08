import * as http from 'http';
import { ApplicationInstance, DefinedProvider } from 'providerjs';
import { Dictonary } from '../common/dictonary';
import { GuidDictonary } from '../common/guid.dictonary';
import { IPipelineType, IPipeline, IPipelineDelegate } from './pipeline';
import { HttpApplicationData } from './httpApplication.decorator';
import { Configure } from './configure';
import { IHttpApplication, IContext } from './httpApplication.data';
import { ConfigureServices } from './configureServices';
import { IDiagnostic, DIAGNOSTIC_LEVEL_PROVIDER, DIAGNOSTIC_PROVIDER, DiagnosticLevel, DIAGNOSTIC_INSTANCE } from '../diagnostic/diagnostic.data';
import { DefaultDiagnostic } from '../diagnostic/default.diagnostic';

export class HttpApplicationInstance extends ApplicationInstance {

    private httpServer?: http.Server;
    private data: HttpApplicationData;
    private pipes?: IPipelineType[];
    private serverValues: Dictonary<any>;
    private contexts: GuidDictonary<IContext>;
    private diagnostic: IDiagnostic;

    constructor(
        cls: Object
    ) {
        super(cls);

        this.serverValues = new Dictonary<any>();
        this.contexts = new GuidDictonary<IContext>();

        this.data = <HttpApplicationData>Reflect.getOwnMetadata('module:data', cls);

        this.setServerValues();
        this.diagnostic = this.setDiagnostic();
    }

    protected appOnInit(): void {
        this.httpServer = this.configureServices();
        this.pipes = this.configure();
        this.startServer();
    }

    private setServerValues(): void {
        this.serverValues.set('approot', this.data.approot);
        this.serverValues.set('wwwroot', this.data.wwwroot);
    }

    private setDiagnostic(): IDiagnostic {
        let diagnostic = <IDiagnostic>this.module.get(DIAGNOSTIC_PROVIDER, false);
        if (!diagnostic) {
            diagnostic = new DefaultDiagnostic(this.data.diagnostic || DiagnosticLevel.Normal)
        }
        const diagnosticLevelProvider = new DefinedProvider(DIAGNOSTIC_LEVEL_PROVIDER, this.data.diagnostic || DiagnosticLevel.Normal);
        const diagnosticInstanceProvider = new DefinedProvider(DIAGNOSTIC_INSTANCE, diagnostic);
        this.module.providers.push(diagnosticLevelProvider, diagnosticInstanceProvider);
        this.module.exports.push(diagnosticLevelProvider, diagnosticInstanceProvider);
        return diagnostic;
    }

    private configureServices(): http.Server {
        const httpServer = http.createServer(this.handleRequest.bind(this));
        const toConfigureServices = new ConfigureServices(this.serverValues, httpServer, this.module.injector);
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
        this.httpServer?.listen(this.data.port || 1338);
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
            let pipe =  (this.pipes) ? this.pipes[index] : undefined;
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
        this.diagnostic?.log(text, level);
    }
}