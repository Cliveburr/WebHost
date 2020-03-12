import * as http from 'http';
import { Dictonary } from '../../system/dictonary';

export class ConfigureServices {

    public constructor(
        public serverValues: Dictonary<any>,
        private appHttpServer: http.Server
    ) {
    }

    public get httpServer(): http.Server {
        return this.appHttpServer;
    }
}