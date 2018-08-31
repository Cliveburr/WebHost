import { ModuleData } from './moduleInstance';

export const Module = (data: ModuleData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('module:data', data, cls);
    }
};