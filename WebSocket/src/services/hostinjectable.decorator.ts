
export interface HostInjectableData {
}

export const HostInjectable = (data?: HostInjectableData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', false, cls);
        Reflect.defineMetadata('injectable:data', data, cls);
        hostInjectables.push(cls);
    };
};

export const hostInjectables = new Array<Object>();