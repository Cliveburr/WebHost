# webhost-websocket
A WebSocket implemantation for [WebHost](https://www.npmjs.com/package/webhost). 

Write using [TypeScript](http://www.typescriptlang.org) with [Visual Studio Code](https://code.visualstudio.com).

```js
import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, DefaultFiles, StaticFiles, IContext } from 'webhost';
import { WebSocketModule, WebSocketService } from 'webhost-websocket';

import { ChatHub } from './chathub';

@HttpApplication({
    imports: [WebSocketModule],
    providers: [ChatHub],
    port: 1800,
    wwwroot: __dirname + '/wwwroot'
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
        private webSocketService: WebSocketService
    ) {
    }

    public configureServices(services: IConfigureServices): void {

        this.webSocketService.configureWebSocket(services);
    }

    public configure(app: IConfigure): void {
     
        app.use((ctx: IContext, next: () => void) => {
            if (ctx.request.url && ctx.request.url.startsWith('/node_modules/')) {
                ctx.request.url = '../../..' + ctx.request.url;
            }
            next();
        });

        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}
```

```js
import { HostService, Path } from 'webhost-websocket';

@Path({
    name: 'chat'
})
export class ChatHub {

    public constructor(
        private host: HostService
    ) {
        setTimeout(() => {
            this.host.callr<string>('getclient')
                .then(d => console.log('client: ' + d));
        }, 3000);
    }

    public send(user: string, msg: string): void {
        this.receive(user, msg);
    }

    public receive(user: string, msg: string): void {
        this.host.callAll('receive', user, msg);
    }
}
```

## Installation

```bash
$ npm install webhost-websocket
```

## Features

  * Lightweight

## Docs

  * [Github](https://github.com/Cliveburr/WebHost/tree/master/WebSocket) for Official Code

## Quick Start

  Create a empty NPM package:

```bash
$ npm init -y
```

  Install WebHost:

```bash
$ npm install webhost-websocket --save 
```

  Work with code:

```bash
$ code .
```

## Example

```bash
https://github.com/Cliveburr/WebHost/tree/master/test/websocket
```