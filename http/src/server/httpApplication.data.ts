import * as http from 'http';
import { IPipelineType } from '../pipe';
import { Dictonary } from '../common/dictonary';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';

export interface IContext {
    guid: string;
    processed: boolean;
    request: http.IncomingMessage;
    response: http.ServerResponse;
    serverValues: Dictonary<any>;
    values: Dictonary<any>;
    log: (text: any, level?: DiagnosticLevel) => void;
}

export interface IHttpApplication {
    configureServices(services: IConfigureServices): void;
    configure(app: IConfigure): void;
}

export interface IConfigure {
    use(pipe: IPipelineType): void;
    useErrorNotFound(): void;
}

export interface IConfigureServices {
    serverValues: Dictonary<any>;
    httpServer: http.Server;
}