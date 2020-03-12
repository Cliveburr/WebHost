import { Injectable, Identify } from 'providerjs';
import { MVC_CONFIGURATION_PROVIDER, IConfiguration } from '../module/configure';

export interface IRoute {
    name: string;
    pattern: string;
    defaults?: { [key: string]: string } | undefined;
    path?: string | undefined;
}

export interface IRouteInfo {
    data: { [key: string]: string };
    route: IRoute;
}

@Injectable()
export class RouteService {
    
    private varRegex: RegExp;
    private routes: IRoute[];

    constructor(
        @Identify(MVC_CONFIGURATION_PROVIDER) configuration: IConfiguration
    ) {
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
        const data: { [key: string]: string }  = {};
        const splitedUrl = url.split('/').filter(f => f !== '');
        const splitedPattern = route.pattern.split('/').filter(f => f !== '');

        if (splitedUrl.length > splitedPattern.length) {
            return undefined;
        }
        else {
            for (let i = 0; i < splitedPattern.length; i++) {
                const splitedPatternTested = this.varRegex.exec(splitedPattern[i]);
                if (splitedPatternTested) {
                    const urlVarName = splitedPatternTested[1];
                    if (splitedUrl.length <= i) {
                        if (route.defaults && urlVarName in route.defaults) {
                            data[urlVarName] = route.defaults[urlVarName];
                        }
                        else if (urlVarName.endsWith('?')) {
                            throw 'Path with ? is unsupported!'
                        }
                        else {
                            return undefined;
                        }
                    }
                    else {
                        data[urlVarName] = splitedUrl[i];
                    }
                }
                else if (splitedUrl[i] !== splitedPattern[i]) {
                    return undefined;
                }
            }
            return {
                data,
                route
            };
        }
    }
}
