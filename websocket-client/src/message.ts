
export interface IMessage {
    path: string;
    id: number;

    method?: string;
    args?: any[];

    return?: any;
    error?: any;
}

export interface IMessageStock {
    timeSent: number;
    msg: IMessage;
    execute?: (value?: any) => void;
    reject?: (reason?: any) => void;
}
