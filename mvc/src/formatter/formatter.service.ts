import { Injectable } from 'providerjs';
import { JSONFormatter } from './json.formatter';

export interface IFormatterSerializeResult {
    contentType: string;
    serializedData: string;
}

export interface IFormatter {
    mimeType: string;
    serialize(data: any): Promise<string>;
    deserialize(data: string): Promise<any>;
}

@Injectable()
export class FormatterService {

    public formatters: Array<IFormatter>;
    public default: IFormatter;

    constructor() {
        this.default = new JSONFormatter();
        this.formatters = [this.default];
    }

    public async serialize(acceptHeaderValue: string | undefined, data: any): Promise<IFormatterSerializeResult> {
        const formatter = this.getFormatterByAcceptHeader(acceptHeaderValue);
        const serializedData = await formatter.serialize(data);
        return {
            contentType: formatter.mimeType,
            serializedData
        };
    }

    public async deserialize(contentTypeValue: string | undefined, data: string): Promise<any> {
        const formatter = this.getFormatterByAcceptHeader(contentTypeValue);
        return await formatter.deserialize(data);
    }

    private getFormatterByAcceptHeader(accept: string | undefined): IFormatter {
        //application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5

        if (accept) {
            const accepts = accept.split(',');
            for (let acpt of accepts) {
                let ret = this.getFormatterByMimeType(acpt);
                if (ret)
                    return ret
                else {
                    let acceptWitoutParams = accept.split(';');
                    let ret = this.getFormatterByMimeType(acceptWitoutParams[0]);
                    if (ret)
                        return ret;
                }
            }
        }
        return this.default;
    }

    private getFormatterByMimeType(mimetype: string): IFormatter | undefined {
        const find = this.formatters
            .filter(f => f.mimeType === mimetype);
        if (find.length > 0) {
            return find[0];
        }
        else {
            return undefined;
        }
    }
}
