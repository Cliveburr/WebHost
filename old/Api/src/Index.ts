import * as webhost from 'webhost';
import * as Interface from './IApi';
import { RouteService } from './services/Route';
import { ControllerSelector } from './services/ControllerSelector';
import { FormatterService } from './services/Formatter';

export * from './Controller';
export * from './IApi';
export * from './pipe/ApiPipe';

export function addServices(services: webhost.IConfigureServices, configuration?: Interface.IConfiguration) {
    services.addSingleton<RouteService>('route', RouteService)
        .on(r => {
            if (configuration && configuration.routes) {
                for (let radd of configuration.routes) {
                    r.addRoute(radd);
                }
            }    
        });

    services.addSingleton<ControllerSelector>('controllerSelector', ControllerSelector)
        .on(cs => {
            if (configuration && configuration.controllerRoot) {
                cs.controllerRoot = configuration.controllerRoot;
            }
        });

    services.addSingleton<FormatterService>('formatter', FormatterService)
        .on(f => {
            if (configuration && configuration.formatterDefault) {
                f.default = configuration.formatterDefault;
            }
            if (configuration && configuration.formatters) {
                f.formatters.push(...configuration.formatters);
            }
        });
}