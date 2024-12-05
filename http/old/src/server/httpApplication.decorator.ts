import { ApplicationData } from 'providerjs';
import { HttpApplicationInstance } from './httpApplication.instance';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';
import path = require('path');

export interface HttpApplicationData extends ApplicationData {
    port?: number;
    diagnostic?: DiagnosticLevel;
    approot?: string;
    wwwroot?: string;
    timeout?: number;
}

export const HttpApplication = (data: HttpApplicationData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);
        Reflect.defineMetadata('application:is', true, cls);
        Reflect.defineMetadata('module:is', true, cls);
        Reflect.defineMetadata('module:data', data, cls);

        if (!data.approot) {
            data.approot = path.resolve(__dirname, '../');
        }

        new HttpApplicationInstance(cls);
    }
};