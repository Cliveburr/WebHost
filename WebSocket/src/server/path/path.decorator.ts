import { IPathData } from '../../shared/path.data';
import { InjectableData, AsRequestProvider } from 'providerjs';

export const Path = (data: IPathData): ClassDecorator => {
    return (cls: Object) => {
        const injectableData: InjectableData = {
            provider: new AsRequestProvider(cls)
        };
        Reflect.defineMetadata('injectable:is', true, cls);
        Reflect.defineMetadata('injectable:data', injectableData, cls);
        Reflect.defineMetadata('path:is', true, cls);
        Reflect.defineMetadata('path:data', data, cls);
    }
}
