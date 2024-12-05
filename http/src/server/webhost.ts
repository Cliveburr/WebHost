import * as http from 'http';
import { IPipeline, IPipelineConstructor, IPipelineDelegate, IPipelineType } from "./pipeline";
import { WebHostConfiguration } from "./webhost.configuration";
import { IRequestContext } from './request.context';
import { Container } from 'providerjs';
import { DiagnosticLevel, IDiagnostic } from '../diagnostic/diagnostic.data';
import { diagnosticProvider } from '../diagnostic/default.diagnostic';

export class WebHost {

    public httpServer: http.Server;
    public provider: Container;
    private pipes: IPipelineType[];
    private diagnostic: IDiagnostic;
    private serverValues: { [key: string]: any };

    public constructor(
        private config: WebHostConfiguration
    ) {
        this.pipes = [];
        this.provider = new Container();
        this.diagnostic = this.provider.get(diagnosticProvider);
        this.httpServer = this.setHttpServer();
        this.serverValues = this.setServerValues();
    }

    private setServerValues(): { [key: string]: any } {
        return {
            'wwwroot': this.config.wwwroot,
            'approot': this.config.approot
        }
    }

    private setHttpServer(): http.Server {
        let httpServer: http.Server;
        if (global.host) {
            httpServer = global.host.httpServer;
            httpServer.off('request', global.host.handleRequestBind);
            delete global.host;
        }
        else {
            httpServer = http.createServer();
        }
        return httpServer;
    }

    public use(pipe: IPipelineType): void {
        this.pipes.push(pipe);
    }

    public run(): void {
        const handleRequestBind = this.handleRequest.bind(this);
        this.httpServer.on('request', handleRequestBind);
        global.host = {
            httpServer: this.httpServer,
            handleRequestBind: handleRequestBind
        };
        const port = this.config.port || 1338;
        if (!this.httpServer.listening) {
            this.httpServer.listen(port);
        }
        this.logDiagnostic('Server started: http://localhost:' + port);
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        let ctx: IRequestContext = {
            //guid: '',
            processed: false,
            request: req,
            response: res,
            serverValues: this.serverValues,
            values: {},
            log: this.logDiagnostic.bind(this),
            //terminated: false,
            provider: this.provider.createScope()
        };
        //ctx.guid = this.contexts.autoSet(ctx);
        this.processRequest(ctx)
            .then();
    }

    private async processRequest(ctx: IRequestContext): Promise<void> {
        for (const pipe of this.pipes) {
            
            if (ctx.processed) {
                break;
            }

            if (this.config.timeout) {
                ctx.timeout = setTimeout(this.timeoutHandler.bind(this, ctx), this.config.timeout);
            }

            try {
                await this.processPipe(ctx, pipe);
            }
            catch (err) {
                if (ctx.response.writable && !ctx.processed) {
                    ctx.response.statusCode = 500;
                    ctx.response.write(JSON.stringify(err)); //TODO: error handler
                    ctx.response.end();
                }
            }
            finally {
                if (ctx.timeout) {
                    clearTimeout(ctx.timeout);
                    delete ctx.timeout;
                }
            }
        }
        if (ctx.response.writable) {
            ctx.response.end();
        }
    }

    private checkPipeIsObject(pipe: IPipelineType): pipe is IPipeline {
        return typeof pipe === 'object' && 'process' in pipe;
    }

    private checkPipeIsConstructor(pipe: IPipelineType): pipe is IPipelineConstructor {
        return typeof pipe === 'function' && 'prototype' in pipe;
    }

    private async processPipe(ctx: IRequestContext, pipe: IPipelineType): Promise<void> {
        if (this.checkPipeIsObject(pipe)) {
            await pipe.process(ctx);
        }
        else if (this.checkPipeIsConstructor(pipe)) {
            const instance = new pipe(ctx.provider);
            await instance.process(ctx);
        }
        else {
            await (pipe as IPipelineDelegate)(ctx);
        }
    }

    private timeoutHandler(ctx: IRequestContext): void {
        if (!ctx.response.writable || ctx.processed) {
            return;
        }
        this.logDiagnostic(`Timeout: ${ctx.request.url}`, DiagnosticLevel.Error);
        ctx.response.statusCode = 408;
        ctx.response.end();
        //ctx.terminated = true;
        //this.contexts.remove(ctx.guid);
        // if (ctx.processResult) {
        //     Promise.resolve(ctx.processResult)
        //         .then()
        //         .catch();
        // }
    }

    private logDiagnostic(text: any, level?: DiagnosticLevel): void {
        this.diagnostic?.log(text, level);
    }
}