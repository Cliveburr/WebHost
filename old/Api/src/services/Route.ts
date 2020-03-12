import * as Interface from '../IApi';

export class RouteService {
    private _varRegex: RegExp = /^\{(.*?)\}$/i;
    
    public routes: Array<Interface.IRoute>;

    constructor() {
        this.routes = [];
    }

    public addRoute(route: Interface.IRoute) {
        this.routes.push({
            name: route.name,
            pattern: route.pattern,
            defaults: route.defaults
        });
    }

    public getRouteByUrl(url: string): RouteInfo {
        for (let route of this.routes) {
            let info = this.match(url, route);
            if (info)
            return info;
        }
        return null;
    }

    private match(url: string, route: Interface.IRoute): RouteInfo {
        let data = {};
        let splitedUrl = url.split('/').filter(f => f !== '');
        let splitedPattern = route.pattern.split('/').filter(f => f !== '');

        if (splitedUrl.length > splitedPattern.length) {
            return null;
        } else {
            for (var i = 0; i < splitedPattern.length; i++) {
                if (this._varRegex.test(splitedPattern[i])) {
                    var urlVarName = this._varRegex.exec(splitedPattern[i])[1];
                    if (splitedUrl.length < i) {
                        if (route.defaults && urlVarName in route.defaults) {
                            data[urlVarName] = route.defaults[urlVarName];
                        } else if (urlVarName.endsWith('?')) {
                            
                        } else {
                            return null;
                        }
                    } else {
                        data[urlVarName] = splitedUrl[i];
                    }
                }
                else if (splitedUrl[i] !== splitedPattern[i]) {
                    return null
                }
            }
            return new RouteInfo(data, route);
        }
    }
}

export class RouteInfo {
    constructor(
        private _data: any,
        private _route: Interface.IRoute
    ){
    }

    public get route(): Interface.IRoute {
        return this._route;
    }

    public get data(): any {
        return this._data;
    }

    public getData(name: string): string {
        return this._data[name];
    }
}