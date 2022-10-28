import * as http from 'http';
import { ApplicationInstance, DefinedProvider } from 'providerjs';
import { Dictonary } from '../common/dictonary';
import { GuidDictonary } from '../common/guid.dictonary';
import { IPipelineType, IPipeline, IPipelineDelegate, IPipelineConstructor } from './pipeline';
import { HttpApplicationData } from './httpApplication.decorator';
import { Configure } from './configure';
import { IHttpApplication, IContext } from './httpApplication.data';
import { ConfigureServices } from './configureServices';
import { IDiagnostic, DIAGNOSTIC_LEVEL, DiagnosticLevel, DIAGNOSTIC } from '../diagnostic/diagnostic.data';
import { DefaultDiagnostic } from '../diagnostic/default.diagnostic';

export class HttpApplicationInstance extends ApplicationInstance {

    private httpServer?: http.Server;
    private data: HttpApplicationData;
    private pipes?: IPipelineType[];
    private serverValues: Dictonary<any>;
    private contexts: GuidDictonary<IContext>;
    private diagnostic: IDiagnostic;
    private handleRequestBind?: (...args: any[]) => void;

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
        const diagnosticLevelProvider = new DefinedProvider(DIAGNOSTIC_LEVEL, this.data.diagnostic || DiagnosticLevel.Normal);
        let diagnostic = <IDiagnostic>this.module.get(DIAGNOSTIC, false, [diagnosticLevelProvider]);
        if (!diagnostic) {
            diagnostic = new DefaultDiagnostic(this.data.diagnostic || DiagnosticLevel.Normal)
            const diagnosticInstanceProvider = new DefinedProvider(DIAGNOSTIC, diagnostic);
            this.module.providers.push(diagnosticInstanceProvider);
            this.module.exports.push(diagnosticInstanceProvider);
        }
        return diagnostic;
    }

    private configureServices(): http.Server {
        let httpServer: http.Server;
        if (global.host) {
            httpServer = global.host.httpServer;
            httpServer.off('request', global.host.handleRequestBind);
            delete global.host;
        }
        else {
            httpServer = http.createServer();
        }
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
        this.handleRequestBind = this.handleRequest.bind(this);
        this.httpServer!.on('request', this.handleRequestBind);
        global.host = {
            httpServer: this.httpServer!,
            handleRequestBind: this.handleRequestBind
        };
        const port = this.data.port || 1338;
        if (!this.httpServer!.listening) {
            this.httpServer!.listen(port);
        }
        this.logDiagnostic('Server started: http://localhost:' + port);
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        let ctx: IContext = {
            guid: '',
            processed: false,
            request: req,
            response: res,
            serverValues: this.serverValues,
            values: new Dictonary<any>(),
            log: this.logDiagnostic.bind(this),
            terminated: false
        };
        ctx.guid = this.contexts.autoSet(ctx);
        this.processPipe(ctx, 0);
    }

    private timeoutHandler(ctx: IContext): void {
        this.logDiagnostic(`Timeout: ${ctx.request.url}`, DiagnosticLevel.Error);
        ctx.response.statusCode = 408;
        ctx.response.end();
        ctx.terminated = true;
        this.contexts.remove(ctx.guid);

        if (ctx.processResult) {
            Promise.resolve(ctx.processResult)
                .then()
                .catch();
        }
    }

    private processPipe(ctx: IContext, index: number): void {
        if (ctx.terminated) {
            if (ctx.processResult) {
                Promise.resolve(ctx.processResult)
                    .then()
                    .catch();
            }
            return;
        }
        if (ctx.timeout) {
            clearTimeout(ctx.timeout);
            delete ctx.timeout;
        }
        try {
            const pipe = (this.pipes) ? this.pipes[index] : undefined;
            if (pipe && !ctx.processed) {
                if (this.data.timeout) {
                    ctx.timeout = setTimeout(this.timeoutHandler.bind(this, ctx), this.data.timeout);
                }
                if ('process' in (pipe as IPipeline)) {
                    ctx.processResult = (pipe as IPipeline).process(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
                else if ((pipe as IPipelineConstructor).prototype) {
                    const instance = this.module.injector.get(pipe) as IPipeline;
                    ctx.processResult = instance.process(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
                else {
                    ctx.processResult = (pipe as IPipelineDelegate)(ctx, this.processPipe.bind(this, ctx, index + 1));
                }
            }
            else {
                ctx.response.end();
                ctx.terminated = true;
                this.contexts.remove(ctx.guid);
            }
        }
        catch (err) {
            this.logDiagnostic(err, DiagnosticLevel.Error);
            ctx.response.statusCode = 500;
            ctx.response.write(JSON.stringify(err));
            ctx.response.end();
            ctx.terminated = true;
            this.contexts.remove(ctx.guid);
        }
    }

    private logDiagnostic(text: any, level?: DiagnosticLevel): void {
        this.diagnostic?.log(text, level);
    }
}