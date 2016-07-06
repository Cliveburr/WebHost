import * as IHttp from './IHttp';

export default class Injector {
    private _services: IHttp.IServices[];
    private _requestCache: any;

    constructor() {
        this._services = [];
        this._requestCache = {};
    }

    public add(service: IHttp.IServices): void {
        this._services.push(service);
    }

    public make(ctx: IHttp.IContext, obj: any, ...params: any[]): any {
        if (!obj['$inject']) {
            return new obj(params);
        }
        else {
            let injection = [];
            let inject = <string[]>obj['$inject'];

            for (let i = 0, inj: string; inj = inject[i]; i++) {
                let instance = this.read(ctx, inj);
                if (!instance)
                    throw `Dependencie ${ inj } not found!'`;

                injection.push(instance);
            }

            return new (Function.prototype.bind.apply(obj, [null].concat(injection.concat(params))));
        }
    }

    public read(ctx: IHttp.IContext, name: string): any {
        let findService = this._services.filter((s) => name == s.name);
        if (findService.length == 0)
            return null;

        let service = findService[0];
        let instance = null;
        switch (service.type) {
            case IHttp.ServicesType.Singleton:
                {
                    if (!service.instances) {
                        service.instances = service.getInstance(ctx);
                    }
                    instance = service.instances;
                    break;
                }
            case IHttp.ServicesType.Local:
                {
                    instance = service.getInstance(ctx);
                    break;
                }
            case IHttp.ServicesType.PerRequest:
                {
                    if (!service.instances)
                        service.instances = {};

                    if (!(ctx.guid in service.instances)) {
                        service.instances[ctx.guid] = service.getInstance(ctx);

                        if (!(ctx.guid in this._requestCache))
                            this._requestCache[ctx.guid] = [];

                        this._requestCache[ctx.guid].push(service);
                    }

                    instance = service.instances[ctx.guid];
                    break;
                }
        }

        return instance;
    }

    public release(ctxGuid: string): void {
        if (ctxGuid in this._requestCache) {
            for (let i = 0, s: IHttp.IServices; s = this._requestCache[ctxGuid][i]; i++) {
                delete s.instances[ctxGuid];
            }
            delete this._requestCache[ctxGuid];
        }
    }
}