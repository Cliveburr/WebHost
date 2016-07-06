import * as http from 'http';
import Event from '../system/Event';
import { AutoDictonary } from '../system/Dictonary';
import Injector from './Injector';
import * as IHttp from './IHttp';
import ErrorNotFound from '../pipe/ErrorNotFound';

export class Server implements IHttp.IServer, IHttp.IServices {
    public httpServer: http.Server;
    public rootApp: string;
    public wwwroot: string;
    public logErrorOnConsole: boolean;
    public name: string;
    public type: IHttp.ServicesType;
    public instances: this;

    private _pipe: IHttp.IPipelineType[];
    private _injector: Injector;
    private _contexts: AutoDictonary<IHttp.IContext>;

    constructor(configs: IHttp.IServerConfigs) {
        this.rootApp = configs.rootApp;
        this.wwwroot = configs.wwwroot;
        this.logErrorOnConsole = true;
        this._pipe = [];
        this.name = 'server';
        this.type = IHttp.ServicesType.Singleton;
        this.instances = this;
        this._injector = new Injector();
        this._injector.add(this);
        this._contexts = new AutoDictonary<IHttp.IContext>('asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789', 10);
        this.httpServer = http.createServer((req, res) => this.handleRequest(req, res));
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
        let ctx: IHttp.IContext = {
            guid: null,
            alreadyProcess: false,
            server: this,
            request: req,
            response: res,
            inject: (obj: any) => this._injector.make(ctx, obj),
            getService: (name: string) => this._injector.read(ctx, name)
        };
        ctx.guid = this._contexts.autoSet(ctx);

        try {
            let i = 0;
            let processPipe = (pipe: IHttp.IPipelineType) => {
                if (pipe && !ctx.alreadyProcess) {
                    if ('$reusable' in pipe && !pipe.$reusable)
                        delete pipe['instance'];

                    let instance = pipe.instance ?
                        pipe.instance :
                        this._injector.make(ctx, pipe);

                    instance.process(ctx, () => {
                        i++;
                        processPipe(this._pipe[i]);
                    });
                }
                else {
                    this.endRequest(ctx);
                }
            };
            processPipe(this._pipe[i]);
        }
        catch (err) {
            if (this.logErrorOnConsole)
                console.log(err);

            ctx.response.statusCode = 500;
            this.endRequest(ctx);
        }
    }

    private endRequest(context: IHttp.IContext): void {
        context.response.end();
        this._injector.release(context.guid);
        this._contexts.remove(context.guid);
    }

    public configureServices(configure: (services: IHttp.IConfigureServices) => void): void {
        configure({
            httpServer: this,
            add: (services) => this.services_add(services),
            addSingleton: (name, service) => this.add_directly(name, service, IHttp.ServicesType.Singleton),
            addLocal: (name, service) => this.add_directly(name, service, IHttp.ServicesType.Local),
            addPerRequest: (name, service) => this.add_directly(name, service, IHttp.ServicesType.PerRequest)
        });
    }

    public configure(configure: (app: IHttp.IConfigure) => void): void {
        configure({
            use: (pipe) => this.pipe_use(pipe),
            useErrorNotFound: () => this.pipe_use(ErrorNotFound),
            useService: (name) => this._injector.read(null, name)
        });
    }

    public listen(port: number): void {
        this._injector.release('ini');
        this.httpServer.listen(port);
    }

    private pipe_use(pipe: IHttp.IPipelineType): void {
        this._pipe.push(pipe);
    }

    private services_add<T extends IHttp.IServices>(service: IHttp.IServicesType): IHttp.IServicesFluent<T> {
        let newService = new service();

        this._injector.add(newService);

        let fluent = {
            on: (callBack) => {
                if (newService.on_create)
                    newService.on_create.add(callBack);
                return fluent;
            },
            off: (callBack) => {
                if (newService.on_destroy)
                    newService.on_destroy.add(callBack);
                return fluent;
            }
        };

        return fluent;
    }

    private add_directly<T extends IHttp.IServices>(name: string, service: IHttp.IServicesDirectlyType, type: IHttp.ServicesType): IHttp.IServicesFluent<T> {
        var newService: IHttp.IServices = {
            name: name,
            type: type,
            getInstance: (ctx) => {
                var instance = this._injector.make(ctx, service)
                if (newService.on_create)
                    newService.on_create.raise(instance);
                return instance;
            },
            on_create: new Event<(service: any) => void>(),
            on_destroy: new Event<(service: any) => void>()
        };

        this._injector.add(newService);

        var fluent = {
            on: (callBack) => {
                newService.on_create.add(callBack);
                return fluent;
            },
            off: (callBack) => {
                newService.on_destroy.add(callBack);
                return fluent;
            }
        };

        return fluent;
    }

    public getInstance(ctx: IHttp.IContext): this {
        return this.instances;
    }
}