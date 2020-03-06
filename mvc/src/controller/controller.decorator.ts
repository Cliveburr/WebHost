import { InjectableData } from 'providerjs';

export interface ControllerData extends InjectableData {
}

export const Controller = (data?: ControllerData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);
        
        if (data) {
            Reflect.defineMetadata('injectable:data', data, cls);
        }
    }
}
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export const HttpGet = (): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        //let key = `required:is:${propertyKey?.toString()}:${parameterIndex.toString()}`;
        Reflect.defineMetadata(propertyKey, descriptor, target);
    }
}

// export const HttpGet = (): ParameterDecorator => {
//     return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
//         let key = `required:is:${propertyKey?.toString()}:${parameterIndex.toString()}`;
//         Reflect.defineMetadata(key, true, target);
//     }
// }
