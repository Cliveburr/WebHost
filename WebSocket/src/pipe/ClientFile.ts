import { IPipeline, IContext } from 'webhost';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export class ClientFile implements IPipeline {
    public process(ctx: IContext, next: () => void): void {
        if (ctx.request.url == '/WebSocket') {

            var file = resolve(__dirname + '/../client/WebSocket.js');

            ctx.response.writeHead(200, { "Content-Type": 'text/javascript' });
            ctx.response.write(readFileSync(file).toString());
            ctx.alreadyProcess = true;
        }

        next();
    }
}