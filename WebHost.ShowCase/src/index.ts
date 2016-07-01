/// <reference path="../typings/index.d.ts" />
import webhost = require('webhost/lib/http/server');
import DefaultFiles = require('webhost/lib/pipe/DefaultFiles');
import StaticFiles = require('webhost/lib/pipe/StaticFiles');

var server = new webhost({
    rootApp: __dirname,
    wwwroot: __dirname + '/../src/wwwroot'
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(DefaultFiles);

    app.use(StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);