import * as http from 'http';
import Event from '../system/Event';

export interface IServer {
    httpServer: http.Server;
    rootApp: string;
    wwwroot: string;
    logErrorOnConsole: boolean;
    name: string;
    type: ServicesType;
    instances: this;
    configureServices(configure: (services: IConfigureServices) => void): void;
    configure(configure: (app: IConfigure) => void): void
}

export interface IPipeline {
    process(ctx: IContext, next: () => void): void;
}

export interface IPipelineType {
    new (...params: any[]): IPipeline;
    $inject?: string[];
    $reusable?: boolean;
    instance?: IPipeline;
}

export interface IContext {
    guid: string;
    alreadyProcess: boolean;
    server: IServer;
    request: http.IncomingMessage;
    response: http.ServerResponse;
    inject<T>(obj: any, ...params: any[]): T;
    getService<T>(name: string): T;
}

export interface IServicesDirectlyType {
    new (...params: any[]): any;
}

export interface IServices {
    name: string;
    type: ServicesType;
    instances?: any;
    getInstance: (ctx: IContext) => any;
    on_create?: Event<(service: any) => void>;
    on_destroy?: Event<(service: any) => void>;
}

export interface IServicesType {
    new (): IServices;
}

export interface IServicesFluent<T> {
    on(service: (service: T) => void): IServicesFluent<T>;
    off(service: (service: T) => void): IServicesFluent<T>;
}

export interface IConfigureServices {
    httpServer: IServer;
    add<T>(service: IServicesType): IServicesFluent<T>;
    addSingleton<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
    addLocal<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
    addPerRequest<T>(name: string, service: IServicesDirectlyType): IServicesFluent<T>;
}

export interface IConfigure {
    use(pipe: IPipelineType): void;
    useErrorNotFound(): void;
    useService<T>(name: string): T;
    debug(): void;
}

export interface IServerConfigs {
    rootApp: string;
    wwwroot: string;
}

export interface IFileType {
    extension: string;
    contentType: string;
}

export enum ServicesType {
    Singleton = 0,
    Local = 1,
    PerRequest = 2
}