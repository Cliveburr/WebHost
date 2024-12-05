declare type Server = import('http').Server

declare var host: {
    httpServer: Server,
    handleRequestBind: (...args: any[]) => void
} | undefined;
