
export interface InjectableData {

}

export const Injectable = (data?: InjectableData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);

        if (data) {
            Reflect.defineMetadata('injectable:data', data, cls);
        }
    };
};