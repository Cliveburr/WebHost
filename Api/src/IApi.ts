import * as webhost from 'webhost';

export interface IConfiguration {
    routes?: Array<IRoute>;
    controllerRoot?: string;
    formatters?: IFormatter[];
    formatterDefault?: IFormatter;
}

export interface IRoute {
    name: string;
    pattern: string;
    defaults?: any;
}

export interface IControllerType {
    new (): IController;
}

export interface IController {
    context: webhost.IContext;
    response: (result: IHttpResult) => void;
}

export interface IArguments {
    queryString: any,
    routeData: any
}

export interface IHttpResult {
    data: any;
    responseCode: number;
}

export interface IFormatter {
    mimeType: string;
    serialize(data: any, callBack: (responseData: string) => void): void;
    deserialize(data: string): any;
}