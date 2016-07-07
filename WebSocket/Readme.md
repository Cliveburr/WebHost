# webhost
A WebSocket implemantation for [NodeJS](https://www.npmjs.com/package/webhost). 

Write using [TypeScript](http://www.typescriptlang.org) with [Visual Studio Code](https://code.visualstudio.com).

```js
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

  Install the typings for node:

```bash
$ typings install dt~node --global
```

  Install WebHost:

```bash
$ npm install webhost --save
$ npm install webhost-websocket --save 
```

  Work with code:

```bash
$ code .
```

## Example

```bash
https://github.com/Cliveburr/WebHost/tree/master/Examples/Chat
```