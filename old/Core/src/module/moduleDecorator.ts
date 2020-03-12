import { ModuleData } from './moduleInstance';

export const Module = (data: ModuleData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('module:is', true, cls);
        Reflect.defineMetadata('module:data', data, cls);
    }
};