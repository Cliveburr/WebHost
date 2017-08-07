import { IPipeline, IFileType, IContext } from '../http/IHttp';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

export class StaticFiles implements IPipeline {
    public static fileTypes: IFileType[] = [
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
        { extension: '.json', contentType: 'application/json' },
        { extension: '.svg', contentType: 'image/svg+xml' },
        { extension: '.ttf', contentType: 'application/x-font-ttf' },
        { extension: '.otf', contentType: 'application/x-font-opentype' },
        { extension: '.woff', contentType: 'application/font-woff' },
        { extension: '.woff2', contentType: 'application/font-woff2' },
        { extension: '.eot', contentType: 'application/vnd.ms-fontobject' },
        { extension: '.sfnt', contentType: 'application/font-sfnt' }
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

    public process(ctx: IContext, next: () => void): void {
        let pu = url.parse(ctx.request.url);

        let file = path.resolve(ctx.server.wwwroot + pu.pathname);

        console.log(`${ctx.request.method}::${file}`);
        
        if (fs.existsSync(file)) {
            let extension = path.extname(file);
            if (extension == '.gz') {
                extension = path.extname(file.substr(0, file.length - 3));
                let contentType = StaticFiles.getContentType(extension);
                if (contentType) {
                    ctx.response.writeHead(200, { "Content-Encoding": "gzip", "Content-Type": contentType });
                    ctx.response.write(fs.readFileSync(file));
                    ctx.alreadyProcess = true;
                }
            }
            else {
                let contentType = StaticFiles.getContentType(extension);
                if (contentType) {
                    ctx.response.writeHead(200, { "Content-Type": contentType });
                    ctx.response.write(fs.readFileSync(file));
                    ctx.alreadyProcess = true;
                }
            }
        }

        next();
    }
}