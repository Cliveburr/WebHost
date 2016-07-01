import IHttp = require('../http/IHttp');
import path = require('path');
import fs = require('fs');
import url = require('url');

class StaticFiles implements IHttp.IPipeline {
    public static fileTypes: IHttp.IFileType[] = [
        { extension: '.js', contentType: 'text/javascript' },
        { extension: '.map', contentType: 'application/json' },
        { extension: '.ts', contentType: 'text/x-typescript' },
        { extension: '.html', contentType: 'text/html' },
        { extension: '.css', contentType: 'text/css' }
    ];

    public process(ctx: IHttp.IContext, next: () => void): void {
        let pu = url.parse(ctx.request.url);

        let file = path.resolve(ctx.server.wwwroot + pu.pathname);

        console.log(file);

        if (fs.existsSync(file)) {
            var extension = path.extname(file);
            var tp = StaticFiles.fileTypes.filterOne((t) => t.extension == extension);
            if (tp) {
                ctx.response.setHeader('etag', '1234');
                ctx.response.writeHead(200, { "Content-Type": tp.contentType });
                ctx.response.write(fs.readFileSync(file).toString());
                ctx.alreadyProcess = true;
            }
        }

        next();
    }
}

export = StaticFiles;