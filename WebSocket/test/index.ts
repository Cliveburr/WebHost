import { Server, DefaultFiles, StaticFiles } from 'webhost';
import { addServices, ClientFile } from '../src/Index';
import ChatHub from './ChatHub';

var server = new Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services): void => {

    addServices(services, [
        { path: 'Chat', item: ChatHub }
    ]);

});

server.configure((app) => {
    
    app.use(ClientFile);

    app.use(DefaultFiles);

    app.use(StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);