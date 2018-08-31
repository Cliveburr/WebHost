#! /usr/bin/env node

import * as path from 'path';
import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles } from 'webhost';
import { SpaPipe } from './spa.pipe';

var args = process.argv.slice(2);

let root = path.resolve(__dirname + '\\..\\..\\..\\' + args[0]);
let port = +args[1];
let indexFile = args.length == 3 ? args[2] : 'index.html';

console.log('Hosting with Webhost!')
console.log('Root: ' + root);
console.log('Port: ' + port)

@HttpApplication({
    providers: [SpaPipe],
    port: port,
    wwwroot: root
})
export class ServerSpaApplication implements IHttpApplication {

    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {

        services.serverValues.set('indexFile', indexFile);
    }

    public configure(app: IConfigure): void {
     
        app.use(SpaPipe);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}