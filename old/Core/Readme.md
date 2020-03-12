# webhost
A [NodeJS](http://nodejs.org) framework for create general purpose web services.

Write using [TypeScript](http://www.typescriptlang.org) with [Visual Studio Code](https://code.visualstudio.com).

```ts
import { HttpApplication, IHttpApplication, IConfigure, IConfigureServices,
    NotFound, DefaultFiles, StaticFiles } from 'webhost';

@HttpApplication({
    imports: [],
    providers: [],
    port: 1800,
    wwwroot: __dirname + '/wwwroot'
})
export class HttpTestApplication implements IHttpApplication {

    public constructor(
    ) {
    }

    public configureServices(services: IConfigureServices): void {
    }

    public configure(app: IConfigure): void {
     
        app.use(DefaultFiles);

        app.use(StaticFiles);

        app.use(NotFound);
    }
}
```

## Installation

```bash
$ npm install webhost
```

## Features

  * Lightweight
  * Modulate
  * Dependencie Inject system build on
  * Core has none dependencies

## Docs

  * [Github](https://github.com/Cliveburr/WebHost) for Official Code

## Quick Start

  Create a empty NPM package:

```bash
npm init -y
```

  Install WebHost:

```bash
npm install webhost --save
```

  Work with code:

```bash
code .
```

## Example

```bash
https://github.com/Cliveburr/WebHost/tree/master/test
```