import * as urlService from 'url';
import { ReadStream } from 'node:fs';
import { Buffer } from 'node:buffer';
import { IPipeline, IContext, IDiagnostic, DiagnosticLevel } from 'webhost';
import { RouteService } from './route.service';
import { Identify, Injectable } from 'providerjs';
import { ControllerSelector } from '../controller/controller.selector';
import { FormatterService } from '../formatter/formatter.service';
import { HttpError, HttpReponse } from '../controller/reponse-model';

@Injectable()
export class Mvc implements IPipeline {

    public constructor(
        private route: RouteService,
        private controllerSelector: ControllerSelector,
        private formatter: FormatterService,
        @Identify('DIAGNOSTIC') private diagnostic: IDiagnostic
    ) {
    }

    public async process(ctx: IContext, next: () => void): Promise<void> {
        const urlParsed = urlService.parse(ctx.request.url || '/');
        const route = this.route.getRouteByUrl(urlParsed.pathname || '');
        if (route) {
            ctx.processed = true;
            try {
                const result = await this.controllerSelector.processRequest(ctx, route);
                await this.processResult(ctx, result); 
            }
            catch (err) {
                if (err instanceof HttpError) {
                    this.diagnostic.log(err.error, DiagnosticLevel.Error);
                    await this.processResult(ctx, new HttpReponse(err.code, err.error));
                }
                else {
                    this.diagnostic.log(err, DiagnosticLevel.Error);
                    await this.processResult(ctx, new HttpReponse(500, err));
                }
            }
        }
        next();
    }

    private async processResult(ctx: IContext, response: HttpReponse): Promise<void> {
        if (response.data) {
            const accept = ctx.request.headers['accept'];
            const serialized = await this.formatter.serialize(accept, response.data);
            return new Promise<void>((e, r) => {
                const data = Buffer.from(serialized.serializedData);
                ctx.response.writeHead(response.code, {
                    'content-type': serialized.contentType,
                    'content-length': data.byteLength
                });
                const stream = ReadStream.from(data);
                stream.once('end', e);
                stream.once('error', r);
                stream.pipe(ctx.response);
                stream.emit('data', data);
            });
        }
        else {
            ctx.response.writeHead(response.code);
        }
    }
}