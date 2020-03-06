import { Module } from 'providerjs';
import { MvcPipe } from '../pipe/mvc.pipe';
import { IdentityPipe } from '../pipe/identity.pipe';
import { RouteService } from '../pipe/route.service';
import { ControllerSelector } from '../controller/controller.selector';
import { FormatterService } from '../formatter/formatter.service';

@Module({
    providers: [MvcPipe, IdentityPipe, RouteService, ControllerSelector, FormatterService],
    exports: [MvcPipe, IdentityPipe]
})
export class MvcModule {

}