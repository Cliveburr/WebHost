import { OutgoingHttpHeaders } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { Injectable } from 'providerjs';
import { IPipeline } from '../server/pipeline';
import { IContext } from '../server/httpApplication.data';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';
import { Dictonary } from '../common/dictonary';

export interface IFileType {
    extension: string;
    contentType: string;
}

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
    public hasContent: boolean | undefined;
    public headers: OutgoingHttpHeaders;
    public statusCode: number;
    public isExist: boolean;
    public isValid: boolean;

    public constructor(
        public file: string,
        public requestHeaders: OutgoingHttpHeaders,
        public fileTypes: Dictonary<string>
    ) {
        this.statusCode = 0;
        this.headers = {};
        this.isExist = this.checkFileExist();
        this.isValid = this.checkContenType();

        if (this.isExist) {
            this.checkContentAndCache();
        }
    }

    private checkFileExist(): boolean {
        return fs.existsSync(this.file);
    }

    private checkContenType(): boolean {
        let extension = path.extname(this.file);
        if (extension == '.gz') {
            extension = path.extname(this.file.substr(0, this.file.length - 3));
            let contentType = this.fileTypes.get(extension);
            if (contentType) {
                this.headers['Content-Encoding'] = 'gzip';
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        else {
            let contentType = this.fileTypes.get(extension);
            if (contentType) {
                this.headers['Content-Type'] = contentType;
                return true;
            }
        }
        return false;
    }

    private checkContentAndCache(): void {
        const stat = fs.statSync(this.file);
        this.headers['Content-Length'] = stat.size;

        if (this.requestHeaders['cache-control'] && this.requestHeaders['cache-control'] == 'no-cache') {
            this.statusCode = 200;
            this.hasContent = true;
            return;
        }

        const modified = stat.mtime;
        modified.setMilliseconds(0);

        this.headers['Last-Modified'] = modified.toString();
        this.headers['Cache-Control'] = 'private';
        
        let modifiendSince = this.requestHeaders['if-modified-since'];
        if (modifiendSince) {
            let since = new Date(modifiendSince.toString());
            since.setMilliseconds(0);

            if (modified.getTime() <= since.getTime()) {
                this.statusCode = 304;
                return;
            }
        }

        this.statusCode = 200;
        this.hasContent = true;
    }
}

@Injectable()
export class StaticFiles implements IPipeline {

    private fileTypes: Dictonary<string>;

    public constructor(
    ) {
        this.fileTypes = new Dictonary<string>();
        for (let type of fileTypes) {
            this.fileTypes.set(type.extension, type.contentType);
        }
    }

    public async process(ctx: IContext, next: () => void): Promise<void> {
        const wwwroot = ctx.serverValues.get('wwwroot');
        if (!wwwroot) {
            throw 'To use static files, need to set wwwroot on application!';
        }

        const pu = url.parse(ctx.request.url || '');
        const file = path.resolve(wwwroot + pu.pathname);
        const fileInfo = new FileInfo(file, ctx.request.headers, this.fileTypes);

        if (fileInfo.isValid) {
            ctx.processed = true;
            if (fileInfo.isExist) {
                ctx.log(`${ctx.request.method}:${fileInfo.statusCode}:${file}`);

                if (fileInfo.hasContent) {
                    ctx.response.writeHead(fileInfo.statusCode, fileInfo.headers);
                    await this.processFile(ctx, file);
                    // const readStream = fs.createReadStream(file);
                    // readStream.on('open',  () => {
                    //     readStream.pipe(ctx.response);
                    // });
                    // readStream.on('close', () => {
                    //     next();
                    // });
                    // readStream.on('error', (err) => {
                    //     ctx.log(err, DiagnosticLevel.Error);
                    // });
                    // return;
                }
                else {
                    ctx.response.writeHead(fileInfo.statusCode, fileInfo.headers);
                }
            }
            else {
                ctx.log(`${ctx.request.method}:INVALID:${file}`, DiagnosticLevel.Error);
            }
        }
        next();
    }

    private processFile(ctx: IContext, file: string): Promise<void> {
        return new Promise<void>((e, r) => {
            const readStream = fs.createReadStream(file);
            readStream.on('open',  () => {
                readStream.pipe(ctx.response);
            });
            readStream.on('end', e);
            readStream.on('error', r);
        });
    }
}