import * as http from 'http';
import { ScopeContainer } from 'providerjs';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';

export interface IRequestContext {
    //guid: string;
    processed: boolean;
    request: http.IncomingMessage;
    response: http.ServerResponse;
    serverValues: { [key: string]: any };
    values: { [key: string]: any };
    log: (text: any, level?: DiagnosticLevel) => void;
    timeout?: any;
    // processing?: Promise<void>;
    // terminated: boolean;
    provider: ScopeContainer;
}
