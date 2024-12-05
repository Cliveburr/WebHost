import * as http from 'http';
import { Dictonary } from '../common/dictonary';
import { IConfigureServices } from './httpApplication.data';
import { Injector } from 'providerjs';

export class ConfigureServices implements IConfigureServices {

    public constructor(
        public serverValues: Dictonary<any>,
        private appHttpServer: http.Server,
        private appInjector: Injector
    ) {
    }

    public get httpServer(): http.Server {
        return this.appHttpServer;
    }

    public get injector(): Injector {
        return this.appInjector;
    }
}