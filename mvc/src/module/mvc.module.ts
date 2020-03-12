import { Module, Injector } from 'providerjs';
import { MvcPipe } from '../pipe/mvc.pipe';
import { RouteService } from '../pipe/route.service';
import { ControllerSelector } from '../controller/controller.selector';
import { FormatterService } from '../formatter/formatter.service';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [SessionModule],
    providers: [MvcPipe, RouteService, ControllerSelector, FormatterService],
    exports: [MvcPipe, SessionModule]
})
export class MvcModule {

    public constructor(
        public injector: Injector
    ) {
    }
}