import * as http from 'http';
import { ApplicationData } from '../../application/appInstance';
import { IPipelineType } from '../pipe';
import { Dictonary } from '../../system/dictonary';

export interface HttpApplicationData extends ApplicationData {
    port?: number;
    diagnostic?: Diagnostic;
    wwwroot?: string;
}

export interface IHttpApplication {
    configureServices(services: IConfigureServices): void;
    configure(app: IConfigure): void;
}

export enum Diagnostic {
    Silence = 0,
    Error = 1,
    Normal = 2
}

export interface IConfigure {
    use(pipe: IPipelineType): void;
    useErrorNotFound(): void;
    debug(): void;
}

export interface IConfigureServices {
    serverValues: Dictonary<any>;
    httpServer: http.Server;
}