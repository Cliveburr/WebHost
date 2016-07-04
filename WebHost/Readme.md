
  A [NodeJS](http://nodejs.org) framework for create general purpose web services.

  Write using [TypeScript](http://www.typescriptlang.org) with [Visual Studio Code](https://code.visualstudio.com).

```js
/// <reference path="../typings/index.d.ts" />
import webhost = require('webhost/lib/http/server');
import StaticFiles = require('webhost/lib/pipe/StaticFiles');

var server = new webhost({
    rootApp: __dirname,
    wwwroot: __dirname + '/../src/wwwroot'
});

server.configureServices((services): void => {
});

server.configure((app) => {

    app.use(StaticFiles);

    app.useErrorNotFound();

});

server.listen(1338);

```

## Installation

```bash
$ npm install webhost
```

## Features

  * Lightweight
  * Modulate
  * Inject system build on
  * Core has none dependencies

## Docs

  * [Github](https://github.com/Cliveburr/WebHost) for Official Code

## Quick Start

  Create a empty NPM package:

```bash
npm init -y
```

  Install the typings for node:

```bash
typings install dt~node --global
```

  Install WebHost:

```bash
npm install webhost --save
```

  Work with code:

```bash
code .
```

## ShowCase

```bash
https://github.com/Cliveburr/WebHost/tree/master/WebHost.ShowCase
```