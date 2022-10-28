import { InjectableData } from 'providerjs';

export interface ControllerData extends InjectableData {
}

export interface IActionData {
    path: string;
    method: string;
}

export const Controller = (data?: ControllerData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);
        Reflect.defineMetadata('mvc:controller:is', true, cls);
        
        if (data) {
            Reflect.defineMetadata('injectable:data', data, cls);
        }
    }
}
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export const HttpGet = (path: string): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const data = <IActionData>{
            path,
            method: 'GET'
        };
        Reflect.defineMetadata('mvc:action:data', data, target, propertyKey);
    }
}

export const HttpPost = (path: string): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const data = <IActionData>{
            path,
            method: 'POST'
        };
        Reflect.defineMetadata('mvc:action:data', data, target, propertyKey);
    }
}
