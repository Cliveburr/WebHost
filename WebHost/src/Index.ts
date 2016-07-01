import Server = require('./http/Server');
import IHttp = require('./http/IHttp');
import DefaultFiles = require('./pipe/DefaultFiles');
import StaticFiles = require('./pipe/StaticFiles');

module internal {
    export import Interface = IHttp;

    export var Server: Server = Server;

    export var DefaultFiles: DefaultFiles = DefaultFiles;

    export var StaticFiles: StaticFiles = StaticFiles;
}

export = internal;