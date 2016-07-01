import IHttp = require('../http/IHttp');

class DefaultFiles implements IHttp.IPipeline {
     public process(ctx: IHttp.IContext, next: () => void): void {
        if (ctx.request.url == '/') {
            ctx.request.url = '/index.html';
        }
        next();
    }
}

export = DefaultFiles;