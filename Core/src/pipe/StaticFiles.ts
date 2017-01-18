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
        { extension: '.css', contentType: 'text/css' },
        { extension: '.bmp', contentType: 'image/bmp' },
        { extension: '.gif', contentType: 'image/gif' },
        { extension: '.jpg', contentType: 'image/jpg' },
        { extension: '.png', contentType: 'image/png' },
        { extension: '.ico', contentType: 'image/x-icon' },
        { extension: '.json', contentType: 'application/json' }
    ];

    private static fileTypesDic: { [extension: string]: string };

    private static getContentType(extension: string): string | null {
        if (!StaticFiles.fileTypesDic) {
            StaticFiles.fileTypesDic = {};
            for (let type of StaticFiles.fileTypes) {
                StaticFiles.fileTypesDic[type.extension] = type.contentType
            }
        }
        return StaticFiles.fileTypesDic[extension];
    }

    public process(ctx: IHttp.IContext, next: () => void): void {
        let pu = url.parse(ctx.request.url);

        let file = path.resolve(ctx.server.wwwroot + pu.pathname);

        console.log(`${ctx.request.method}::${file}`);
        
        if (fs.existsSync(file)) {
            let extension = path.extname(file);
            let contentType = StaticFiles.getContentType(extension);
            if (contentType) {
                ctx.response.writeHead(200, { "Content-Type": contentType });
                ctx.response.write(fs.readFileSync(file));
                ctx.alreadyProcess = true;
            }
        }

        next();
    }
}