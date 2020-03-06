import { IFormatter } from './formatter.service';

export class JSONFormatter implements IFormatter {

    public get mimeType(): string {
        return 'application/json';
    }

    public async serialize(data: any): Promise<string> {
        return JSON.stringify(data);
    }

    public async deserialize(data: string): Promise<any> {
        return JSON.parse(data);
    }
}
