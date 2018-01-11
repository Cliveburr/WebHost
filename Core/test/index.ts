import { Server, DefaultFiles, StaticFiles } from '../src/index';

var server = new Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(DefaultFiles);

    app.use(StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);