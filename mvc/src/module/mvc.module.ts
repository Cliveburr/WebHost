import { Module, Injector, Required } from 'providerjs';
import { Mvc } from '../pipe/mvc.pipe';
import { RouteService } from '../pipe/route.service';
import { ControllerSelector } from '../controller/controller.selector';
import { FormatterService } from '../formatter/formatter.service';

@Module({
    imports: [],
    providers: [Mvc, RouteService, ControllerSelector, FormatterService],
    exports: [Mvc]
})
export class MvcModule {

    public constructor(
         @Required() public injector: Injector
    ) {
    }
}