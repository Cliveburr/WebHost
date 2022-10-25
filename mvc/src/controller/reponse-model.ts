
export class HttpReponse {

    public constructor(
        public code: number,
        public data?: any
    ) {
    }

    public get isHttpResponse(): boolean {
        return true;
    }
}

export class HttpError {
    
    public constructor(
        public code: number,
        public error?: string
    ) {
    }

    public get isHttpResponse(): boolean {
        return true;
    }
}