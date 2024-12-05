import { OutgoingHttpHeaders } from 'http';
import * as fs from 'fs';
import * as path from 'path';

export interface IFileType {
    extension: string;
    contentType: string;
}

export class FileInfo {
    public hasContent: boolean | undefined;
    public headers: OutgoingHttpHeaders;
    public statusCode: number;

    public constructor(
        public file: string,
        public requestHeaders: OutgoingHttpHeaders,
        public fileTypes: IFileType[]
    ) {
        this.statusCode = 0;
        this.headers = {};
    }

    public exist(): boolean {
        const isExist = fs.existsSync(this.file);
        if (isExist) {
            this.checkContentAndCache();
        }
        else {
            this.statusCode = 404;
        }
        return isExist;
    }

    public isValid(): boolean {
        let extension = path.extname(this.file);
        if (extension == '.gz') {
            extension = path.extname(this.file.substring(0, this.file.length - 3));
            const fileType = this.fileTypes.find((tp) => tp.extension == extension);
            if (fileType) {
                this.headers['Content-Encoding'] = 'gzip';
                this.headers['Content-Type'] = fileType.contentType;
                return true;
            }
        }
        else {
            const fileType = this.fileTypes.find((tp) => tp.extension == extension);
            if (fileType) {
                this.headers['Content-Type'] = fileType.contentType;
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