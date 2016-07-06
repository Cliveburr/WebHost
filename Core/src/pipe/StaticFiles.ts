import * as IHttp from '../http/IHttp';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

export class StaticFiles implements IHttp.IPipeline {
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
            let extension = path.extname(file);
            let findtp = StaticFiles.fileTypes.filter((t) => t.extension == extension);
            if (findtp.length > 0) {
                let tp = findtp[0];
                ctx.response.setHeader('etag', '1234');
                ctx.response.writeHead(200, { "Content-Type": tp.contentType });
                ctx.response.write(fs.readFileSync(file).toString());
                ctx.alreadyProcess = true;
            }
        }

        next();
    }
}