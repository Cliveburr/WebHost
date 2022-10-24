import { Injectable, Identify } from 'providerjs';
import { MVC_CONFIGURATION_PROVIDER, IConfiguration } from '../module/configure';

export interface IRoute {
    prefix: string;
    path?: string | undefined;
}

export interface IRouteInfo {
    route: IRoute;
    ctrName: string;
    urlPaths: string[];
}

@Injectable()
export class RouteService {
    
    private varRegex: RegExp;
    private routes: IRoute[];

    constructor(
        @Identify(MVC_CONFIGURATION_PROVIDER) configuration: IConfiguration
    ) {
        if (!configuration) {
            throw 'Missing configureMvc!';
        }

        this.varRegex = /^\{(.*?)\}$/i;
        this.routes = configuration?.routes || [];
    }

    public getRouteByUrl(url: string): IRouteInfo | undefined {
        for (let route of this.routes) {
            const info = this.match(url, route);
            if (info) {
                return info;
            }
        }
        return undefined;
    }

    private match(url: string, route: IRoute): IRouteInfo | undefined {
        const splitedUrl = url.toLocaleLowerCase()
            .split('/')
            .filter(f => f !== '');

        const splitedPrefix = route.prefix.toLocaleLowerCase()
            .split('/')
            .filter(f => f !== '');

        if (splitedUrl.length < splitedPrefix.length + 1) {
            return undefined;
        }
        else {
            for (let i = 0; i < splitedPrefix.length; i++) {
                if (splitedPrefix[i] != splitedUrl[i]) {
                    return undefined;
                }
            }

            var ctrName = splitedUrl[splitedPrefix.length];

            splitedUrl.splice(0, splitedPrefix.length + 1);

            return {
                route,
                ctrName,
                urlPaths: splitedUrl
            };
        }

        // if (splitedUrl.length > splitedPattern.length) {
        //     return undefined;
        // }
        // else {
        //     for (let i = 0; i < splitedPattern.length; i++) {
        //         const splitedPatternTested = this.varRegex.exec(splitedPattern[i]);
        //         if (splitedPatternTested) {
        //             const urlVarName = splitedPatternTested[1];
        //             if (splitedUrl.length <= i) {
        //                 if (route.defaults && urlVarName in route.defaults) {
        //                     data[urlVarName] = route.defaults[urlVarName];
        //                 }
        //                 else if (urlVarName.endsWith('?')) {
        //                     throw 'Path with ? is unsupported!'
        //                 }
        //                 else {
        //                     return undefined;
        //                 }
        //             }
        //             else {
        //                 data[urlVarName] = splitedUrl[i];
        //             }
        //         }
        //         else if (splitedUrl[i] !== splitedPattern[i]) {
        //             return undefined;
        //         }
        //     }
        //     return {
        //         data,
        //         route
        //     };
        // }
    }
}
