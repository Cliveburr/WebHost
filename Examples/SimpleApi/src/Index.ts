import * as webhost from 'webhost';
import * as api from 'webhost-api';

var server = new webhost.Server({
    rootApp: __dirname,
    wwwroot: __dirname + '/wwwroot'
});

server.configureServices((services): void => {

    api.addServices(services, {
        routes: [{
            name: 'default',
            pattern: 'api/{controller}/{index}'
        }]
    });

});

server.configure((app) => {
    
    //app.debug();

    app.use(api.Api);

    app.useErrorNotFound();

});

server.listen(1338);