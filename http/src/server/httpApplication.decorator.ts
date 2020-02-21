import { ApplicationData } from 'providerjs';
import { HttpApplicationInstance } from './httpApplication.instance';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';

export interface HttpApplicationData extends ApplicationData {
    port?: number;
    diagnostic?: DiagnosticLevel;
    wwwroot?: string;
}

export const HttpApplication = (data: HttpApplicationData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);
        Reflect.defineMetadata('application:is', true, cls);
        Reflect.defineMetadata('module:is', true, cls);
        Reflect.defineMetadata('module:data', data, cls);

        new HttpApplicationInstance(cls);
    }
};