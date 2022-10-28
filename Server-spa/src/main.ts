#! /usr/bin/env node

import * as path from 'path';
import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, StaticFiles, FileModule } from 'webhost';
import { SpaPipe } from './spa.pipe';

console.log(__dirname);

const args = process.argv.slice(2);
const rootArg = args.length > 0 ? args[0] : '.';
const port = args.length > 1 ? +args[1] : 1338;

let adjustedDirname = __dirname;
if (adjustedDirname.endsWith('server-spa\\bin')) {
}
else if (adjustedDirname.endsWith('server-spa\\dist')) {
    adjustedDirname = path.resolve(adjustedDirname + '\\..\\tests');
}
else {
    adjustedDirname = path.resolve(adjustedDirname + '\\..\\..\\..\\');
}

const root = path.resolve(adjustedDirname + '\\' + rootArg + '\\');
const indexFile = args.length == 3 ? args[2] : 'index.html';

console.log('Hosting with Webhost!')
console.log('Root: ' + root);
console.log('Port: ' + port)

@HttpApplication({
    imports: [FileModule],
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