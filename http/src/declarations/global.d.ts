declare type Server = import('http').Server

declare module NodeJS {
    interface Global {
        host?: {
            httpServer: Server,
            handleRequestBind: (...args: any[]) => void
        }
    }
}