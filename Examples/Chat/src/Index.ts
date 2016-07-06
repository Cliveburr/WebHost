import * as webhost from 'webhost';
import * as websocket from 'webhost-websocket';
import ChatHub from './ChatHub';

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services): void => {

    websocket.addServices(services, [
        { path: 'Chat', item: ChatHub }
    ]);

});

server.configure((app) => {
    
    app.use(webhost.DefaultFiles);

    app.use(webhost.StaticFiles);

    app.use(websocket.ClientFile);

    app.useErrorNotFound();

});

server.listen(1338);