import * as path from 'path';
import * as fs from 'fs';
import * as webhost from 'webhost';

export class ClientFile implements webhost.IPipeline {
    public process(ctx: webhost.IContext, next: () => void): void {
        if (ctx.request.url == '/WebSocket') {

            var file = path.resolve(__dirname + '/../client/WebSocket.js');

            ctx.response.writeHead(200, { "Content-Type": 'text/javascript' });
            ctx.response.write(fs.readFileSync(file).toString());
            ctx.alreadyProcess = true;
        }

        next();
    }
}