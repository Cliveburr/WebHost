import * as Interface from '../IApi';

export class FormatterService {
    public formatters: Array<Interface.IFormatter>;
    public default: Interface.IFormatter;

    constructor() {
        this.default = new JSONFormatter();
        this.formatters = [this.default];
    }

    public serialize(acceptHeaderValue: string, data: any, callBack: (responseData: string, contentType: string) => void): void {
        let formatter = this.getFormatterByAcceptHeader(acceptHeaderValue);
        formatter.serialize(data, (responseData) => callBack(responseData, formatter.mimeType));
    }

    public deserialize(contentTypeValue: string, data: any) {
        var formatter = this.getFormatterByAcceptHeader(contentTypeValue);
        return formatter.deserialize(data);
    }

    private getFormatterByAcceptHeader(accept: string): Interface.IFormatter {
        //application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5

        if (accept) {
            let accepts = accept.split(',');
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

    // private getFormatterByContentTypeHeader(contentType: string): IFormatter {
    //     var ret = this.getFormatterByMimeType(contentType);
    //     if (ret) return ret;           
    //     return this.getFormatterByMimeType("application/json");
    // }

    private getFormatterByMimeType(mimetype: string): Interface.IFormatter {
        let find = this.formatters.filter(f => f.mimeType === mimetype);
        if (find.length > 0)
            return find[0];
        else
            return null;
    }
}

export class JSONFormatter implements Interface.IFormatter {
    public mimeType: string;

    constructor() {
        this.mimeType = 'application/json';
    }

    public serialize(data: any, callBack: (responseData: string) => void): void {
        callBack(JSON.stringify(data));
    }

    public deserialize(data: string): any {
        return JSON.parse(data);
    }
}