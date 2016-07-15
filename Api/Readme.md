# webhost-api
A Api implemantation for [WebHost](https://www.npmjs.com/package/webhost). 

Write using [TypeScript](http://www.typescriptlang.org) with [Visual Studio Code](https://code.visualstudio.com).

```js
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
            pattern: 'api/{controller}/{action}'
        }]
    });

});

server.configure((app) => {
    
    app.use(api.Api);

    app.useErrorNotFound();

});

server.listen(1338);

```

## Installation

```bash
$ npm install webhost-api
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
$ npm install webhost-api --save 
```

  Work with code:

```bash
$ code .
```

## Example

```bash
https://github.com/Cliveburr/WebHost/tree/master/Examples/SimpleApi
```