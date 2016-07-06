
export interface IClientHost {
    send(index: number, method: string, ...args: any[]): void;
    sendAll(index: number, method: string, ...args: any[]): void;
    close(): void;
}

export interface IPath {
    index: number;
    name?: string;
    create(client: IClientHost): void;
}

export interface IPathType {
    new (): IPath;
}

export interface IPathItem {
    path: string;
    item: IPathType;
}

export interface IMessage {
    index: number;
    method: string;
    args: any[];
}