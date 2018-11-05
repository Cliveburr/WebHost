import * as http from 'http';
import { HttpApplicationData, IHttpApplication, Diagnostic } from './app.data';
import { Injector } from '../../provider/injectorInstance';
import { AppInstance } from '../../application/appInstance';
import { ModuleService } from '../../module/module.service';
import { Configure } from './configure';
import { IPipelineType, IPipeline } from '../pipe/pipeline';
import { IContext } from './context';
import { NotFound, DefaultFiles, StaticFiles, Debug } from '../pipe';
import { StaticProvider } from '../../provider/providers';
import { Dictonary } from '../../system/dictonary';
import { GuidDictonary } from '../../system/guid.dictonary';
import { ConfigureServices } from './configureServices';

export class HttpAppInstance extends AppInstance {

    private httpServer: http.Server;
    private data: HttpApplicationData;
    private pipes: IPipelineType[];
    private serverValues: Dictonary<any>;
    private contexts: GuidDictonary<IContext>;

    public constructor(
        data: HttpApplicationData,
        cls: Object
    ) {
        super(data, cls);
        this.contexts = new GuidDictonary<IContext>();
        this.startHttp(data);
    }

    public static generate(data: HttpApplicationData, cls: Object): void {
        if (AppInstance.instance) {
            throw 'Only one application is allow for execution!';
        }
        AppInstance.instance = new HttpAppInstance(data, cls);
    }

    private startHttp(data: HttpApplicationData): void {
        this.data = data;

        this.setBasicPipes();
        this.setServerValues();
        this.configureServices();
        this.configure();
        this.startServer();
    }

    private setBasicPipes(): void {
        let basicPipes = [
            new StaticProvider(NotFound),
            new StaticProvider(DefaultFiles),
            new StaticProvider(StaticFiles),
            new StaticProvider(Debug)
        ];

        if (this.providers) {
            this.providers.push(...basicPipes);
        }
        else {
            this.providers = basicPipes;
        }
    }

    private setServerValues(): void {
        this.serverValues = new Dictonary<any>();
        this.serverValues.set('wwwroot', this.data.wwwroot);
    }

    private configureServices(): void {
        this.httpServer = http.createServer(this.handleRequest.bind(this));

        let toConfigureServices = new ConfigureServices(this.serverValues, this.httpServer);
        (<IHttpApplication>this.instance).configureServices(toConfigureServices);
    }

    private configure(): void {
        let toConfigure = new Configure();
        (<IHttpApplication>this.instance).configure(toConfigure.safeUser());
        this.pipes = toConfigure.pipes;
    }

    private startServer(): void {
        this.httpServer.listen(this.data.port || 1338);
        this.logOnConsole(`Server started: http://localhost:${(this.data.port || 1338).toString()}`, Diagnostic.Normal);
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        let ctx: IContext = {
            guid: '',
            processed: false,
            request: req,
            response: res,
            serverValues: this.serverValues,
            values: new Dictonary<any>(),
            log: this.logOnConsole.bind(this)
        };
        ctx.guid = this.contexts.autoSet(ctx);

        try {
            let i = 0;
            let processPipe = (pipe: IPipelineType) => {
                if (pipe && !ctx.processed) {
                    if (!pipe.prototype) {
                        (<any>pipe)(ctx, () => {
                            i++;
                            processPipe(this.pipes[i]);
                        });
                    }
                    else {
                        let instance = this.injector.get(pipe) as IPipeline;

                        instance.process(ctx, () => {
                            i++;
                            processPipe(this.pipes[i]);
                        });
                    }
                }
                else {
                    this.endRequest(ctx);
                }
            };
            processPipe(this.pipes[i]);
        }
        catch (err) {
            this.logOnConsole(err, Diagnostic.Error);
            ctx.response.statusCode = 500;
            this.endRequest(ctx);
        }
    }

    private endRequest(context: IContext): void {
        context.response.end();
        this.contexts.remove(context.guid);
    }

    private logOnConsole(text: any, level?: Diagnostic): void {
        if ((level || Diagnostic.Normal) <= (this.data.diagnostic || Diagnostic.Normal)) {
            console.log(text);
        }
    }
}