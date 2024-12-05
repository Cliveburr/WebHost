import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { IPipeline } from '../server/pipeline';
import { DiagnosticLevel } from '../diagnostic/diagnostic.data';
import { IContainer, makeObjectProvider } from 'providerjs';
import { FileInfo, IFileType } from './fileinfo';
import { IRequestContext } from '../server/request.context';

export const fileTypesProvider = makeObjectProvider<IFileType[]>([
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
]);

export class StaticFiles implements IPipeline {

    private fileTypes: IFileType[];

    public constructor(
        container: IContainer
    ) {
        this.fileTypes = container.get(fileTypesProvider);
    }

    public async process(ctx: IRequestContext): Promise<void> {
        const wwwroot = ctx.serverValues['wwwroot'] as string;
        if (!wwwroot) {
            throw new Error('To use static files, need to set wwwroot on application!');
        }

        const pu = new URL(ctx.request.url || '', `http://${ctx.request.headers.host}/`);
        const file = path.resolve(wwwroot + pu.pathname);
        const fileInfo = new FileInfo(file, ctx.request.headers, this.fileTypes);

        if (!fileInfo.isValid()) {
            return;
        }

        ctx.processed = true;

        if (fileInfo.exist()) {
            ctx.log(`${ctx.request.method}:${fileInfo.statusCode}:${file}`);
        }
        else {
            ctx.log(`${ctx.request.method}:${fileInfo.statusCode}:${file}`, DiagnosticLevel.Error);
        }

        ctx.response.writeHead(fileInfo.statusCode, fileInfo.headers);

        if (fileInfo.hasContent) {
            await this.processFile(ctx, file);
        }
    }

    private processFile(ctx: IRequestContext, file: string): Promise<void> {
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