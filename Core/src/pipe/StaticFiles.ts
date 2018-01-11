import { IPipeline, IFileType, IContext } from '../http/IHttp';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { OutgoingHttpHeaders } from 'http';

export const fileTypes: IFileType[] = [
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

class FileInfo {
    public hasContent: boolean;
    public headers: OutgoingHttpHeaders;
    public statusCode: number;
    public isValid: boolean;

    public constructor(
        public file: string,
        public requestHeaders: OutgoingHttpHeaders
    ) {
        this.headers = {};
        this.isValid = this.checkFile();
    }

    private checkFile(): boolean {
        if (!fs.existsSync(this.file)) {
            return false;
        }

        if (!this.checkContenType()) {
            return false;
        }

        if (!this.checkContentAndCache()) {
            return false;
        }        

        return true;
    }

    private checkContenType(): boolean {
        let extension = path.extname(this.file);
        if (extension == '.gz') {
            extension = path.extname(this.file.substr(0, this.file.length - 3));
            let contentType = StaticFiles.getContentType(extension);
            if (contentType) {
                this.headers['Content-Encoding'] = 'gzip';
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        else {
            let contentType = StaticFiles.getContentType(extension);
            if (contentType) {
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        return false;
    }

    private checkContentAndCache(): boolean {
        if (this.requestHeaders['cache-control'] && this.requestHeaders['cache-control'] == 'no-cache') {
            this.statusCode = 200;
            this.hasContent = true;
            return true;
        }

        let modified = fs.statSync(this.file).mtime;
        modified.setMilliseconds(0);

        this.headers['Last-Modified'] = modified.toString();
        this.headers['Cache-Control'] = 'private';
        
        if (this.requestHeaders['if-modified-since']) {
            let since = new Date(this.requestHeaders['if-modified-since'].toString());
            since.setMilliseconds(0);

            if (modified.getTime() <= since.getTime()) {
                this.statusCode = 304;
                return true;
            }
        }

        this.statusCode = 200;
        this.hasContent = true;
        return true;
    }
}

export class StaticFiles implements IPipeline {

    private static fileTypesDic: { [extension: string]: string };

    public static getContentType(extension: string): string | null {
        if (!StaticFiles.fileTypesDic) {
            StaticFiles.fileTypesDic = {};
            for (let type of fileTypes) {
                StaticFiles.fileTypesDic[type.extension] = type.contentType
            }
        }
        return StaticFiles.fileTypesDic[extension];
    }

    public process(ctx: IContext, next: () => void): void {
        let pu = url.parse(ctx.request.url);

        let file = path.resolve(ctx.server.wwwroot + pu.pathname);

        let fileInfo = new FileInfo(file, ctx.request.headers);

        if (fileInfo.isValid) {
            console.log(`${ctx.request.method}:${fileInfo.statusCode}:${file}`);

            ctx.response.writeHead(fileInfo.statusCode, fileInfo.headers);
            if (fileInfo.hasContent) {
                ctx.response.write(fs.readFileSync(file));
            }
            ctx.alreadyProcess = true;
        }
        else {
            console.log(`${ctx.request.method}:INVALID:${file}`);
        }

        next();
    }
}