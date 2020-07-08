
export class IChatClient {
    public showMsg(user: string, msg: string): void {}
    public getclient(): Promise<string> { return <any>undefined; };
}

export class IChatServer {
    public sendMsg(user: string, msg: string): void {}
    public logOnServer(): Promise<void> { return <any>undefined; }
    public testServerError(): Promise<string> { return <any>undefined; }
}

export var ChatHub = {
    path: 'chat',
    client: IChatClient,
    server: IChatServer
}
