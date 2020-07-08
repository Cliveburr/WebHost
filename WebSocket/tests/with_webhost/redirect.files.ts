import fs from 'fs';
import path from 'path';
import url from 'url';
import { OutgoingHttpHeaders } from 'http';
import { Injectable } from 'providerjs';
import { IPipeline, IContext, DiagnosticLevel } from 'webhost';

interface INodeModules {
    name: string;
    mainFile: string;
}

@Injectable()
export class RedirectFiles implements IPipeline {
    private nodeModules?: INodeModules[];

    public process(ctx: IContext, next: () => void): void {
        // if (ctx.request.url) {
        //     if (ctx.request.url == '/') {
        //         ctx.request.url = '/../../tests/wwwroot/index.html';
        //     }
        //     else if (ctx.request.url.startsWith('/node_modules/')) {
        //         this.redirectNodeModules(ctx);
        //     }
        //     else if (ctx.request.url.endsWith('.html') || ctx.request.url.startsWith('/script')) {
        //         ctx.request.url = '/../../tests/wwwroot/' + ctx.request.url;
        //     }
        //     else if (ctx.request.url.endsWith('.ts')) {
        //         ctx.request.url = '/../../' + ctx.request.url;
        //     }
        //     else {
        //         ctx.request.url = '/wwwroot/' + ctx.request.url;
        //     }
        // }
        if (ctx.request.url) {
            if (ctx.request.url == '/') {
                ctx.request.url = '/../../tests/wwwroot/index.html';
            }
            else if (ctx.request.url.endsWith('.html') || ctx.request.url.startsWith('/script')) {
                ctx.request.url = '/../../tests/wwwroot/' + ctx.request.url;
            }
            else if (ctx.request.url.endsWith('.js')) {
                this.redirectJsFiles(ctx);
            }
            else if (ctx.request.url.endsWith('.ts')) {
                ctx.request.url = '/../../' + ctx.request.url;
            }
            else {
                ctx.request.url = '/wwwroot/' + ctx.request.url;
            }
        }
        next();
    }

    private redirectNodeModules(ctx: IContext): void {
        //ctx.request.url = '/../..' + ctx.request.url;
        if (!this.nodeModules) {
            const wwwroot = ctx.serverValues.get('wwwroot');
            this.nodeModules = this.loadNodeModules(wwwroot);
        }

        for (let nodeModule of this.nodeModules) {
            if (ctx.request.url?.endsWith(nodeModule.name + '.js')) {
                ctx.request.url = '/../../node_modules/' + nodeModule.mainFile;
                return;
            }
        }
    }

    private loadNodeModules(wwwroot: string): INodeModules[] {
        const modules: INodeModules[] = [];
        const nodeModulePath = path.resolve(wwwroot + '/../../node_modules/');
        const modulesPaths = fs.readdirSync(nodeModulePath);
        for (let name of modulesPaths) {
            if (name.startsWith('.')) {
                continue;
            }
            else if (name.startsWith('@')) {

            }
            else {
                modules.push(this.loadModule(name, path.resolve(nodeModulePath + '/' + name)));
            }
        }
        return modules;
    }

    private loadModule(name: string, modulePath: string): INodeModules {
        const packageJson = path.resolve(modulePath, 'package.json');
        const packageObj = JSON.parse(fs.readFileSync(packageJson, 'utf-8'));
        const mainFile = name + '/' + packageObj.main;
        return {
            name,
            mainFile 
        };
    }

    private getModule(name: string): INodeModules | undefined {
        const nModule = this.nodeModules
            ?.filter(nm => nm.name == name);
        if (nModule && nModule.length > 0) {
            return nModule[0];
        }
        else {
            return undefined;
        }
    }

    private urlModuleRegex = /\/node_modules\/(\w*)\/?(.*)/;

    private redirectJsFiles(ctx: IContext): void {
        const wwwroot = ctx.serverValues.get('wwwroot');
        let relative = 'undefined',
            file = '';
        if (ctx.request.url?.startsWith('/node_modules/')) {
            const urlModule = this.urlModuleRegex.exec(ctx.request.url);
            if (urlModule && urlModule.length == 3) {
                if (!this.nodeModules) {
                    this.nodeModules = this.loadNodeModules(wwwroot);
                }
                const nModule = this.getModule(urlModule[1]);
                if (nModule) {
                    relative = '\'' + nModule.name + '\'';
                    if (urlModule[2] == '__main.js') {
                        file = path.resolve(wwwroot + '/../../node_modules/' + nModule.mainFile);
                    }
                    else {
                    }
                }
            }
        }
        else {
            const pu = url.parse(ctx.request.url || '');
            file = path.resolve(wwwroot + '/wwwroot/' + pu.pathname);
        }

        if (fs.existsSync(file)) {
            ctx.log(`${ctx.request.method}:200:${file}`);

            const headers: OutgoingHttpHeaders = {};
            headers['Content-Type'] = 'text/javascript';
            ctx.response.writeHead(200, headers);
            const content = fs.readFileSync(file).toString();
            ctx.response.write('define(' + relative + ',function(require,exports,module){\n'+content+'\n})');
            ctx.processed = true;
        }
        else {
            ctx.log(`${ctx.request.method}:INVALID:${file}`, DiagnosticLevel.Error);
        }
    }

}
