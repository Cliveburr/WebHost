import { Identity } from "./authentication.service";

export const Authorization = (): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('mvc:authorization:is', true, cls);
    }
}

export const AllowAnonymous = (): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata('mvc:authorization:event', () => true, target, propertyKey);
    }
}

export const Authorize = (event: IAuthorizationEvent): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata('mvc:authorization:event', event, target, propertyKey);
    }
}

export interface IAuthorizationEvent {
    (identity: any): boolean;
}