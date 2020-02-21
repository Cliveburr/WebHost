import * as http from 'http';
import { Dictonary } from '../common/dictonary';
import { IConfigureServices } from './httpApplication.data';

export class ConfigureServices implements IConfigureServices {

    public constructor(
        public serverValues: Dictonary<any>,
        private appHttpServer: http.Server
    ) {
    }

    public get httpServer(): http.Server {
        return this.appHttpServer;
    }
}