#! /usr/bin/env node

import * as webhost from 'webhost';
import { SpaPipe, SpaSetIndexFile } from '../src/spa-pipe';
import * as path from 'path';

var args = process.argv.slice(2);

let root = path.resolve(__dirname + '\\..\\..\\..\\' + args[0]);
let port = +args[1];

if (args.length == 3) {
    SpaSetIndexFile(args[2]);
}

console.log('Hosting with Webhost!')
console.log('Root: ' + root);
console.log('Port: ' + port)

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: root
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(SpaPipe);

    app.use(webhost.StaticFiles);

    app.useErrorNotFound();

});

server.listen(port);