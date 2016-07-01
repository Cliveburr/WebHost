import IHttp = require('../http/IHttp');

class ErrorNotFound implements IHttp.IPipeline {
    public process(ctx: IHttp.IContext, next: () => void): void {
        ctx.response.statusCode = 404;
        next();
    }
}

export = ErrorNotFound;