import { HttpApplicationData } from './app.data';
import { HttpAppInstance } from './app.instance';

export const HttpApplication = (data: HttpApplicationData): ClassDecorator => {
    return (cls: Object) => {
        HttpAppInstance.generate(data, cls);
    }
};