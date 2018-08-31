import * as http from 'http';
import { Diagnostic } from './app.data';
import { Dictonary } from '../../system/dictonary';

export interface IContext {
    guid: string;
    processed: boolean;
    request: http.IncomingMessage;
    response: http.ServerResponse;
    serverValues: Dictonary<any>;
    values: Dictonary<any>;
    log: (text: any, level?: Diagnostic) => void;
}