import * as webhost from '../src/index';

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(webhost.DefaultFiles);

    app.use(webhost.StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);