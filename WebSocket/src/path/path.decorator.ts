
export interface PathData {
    name: string;
}

export const Path = (data: PathData): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', false, cls);
        Reflect.defineMetadata('injectable:data', data, cls);
        paths[data.name.toLowerCase()] = cls;
    };
};

export const paths: { [key: string]: Object } = {};