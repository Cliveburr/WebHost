import * as api from 'webhost-api';

class Home extends api.Controller {
    public get(): api.IHttpResult {
        return this.ok({ test: 'somethi' });
        //this.response(this.ok( ))
    }

    public post(args: api.IArguments): void {
        this.response(this.ok({
            outro: 123,
            index: args.routeData.index,
            qs: args.queryString
        }));
    }
}

export = Home;