import { IProvider } from 'providerjs';
import { IConfigureServices } from 'webhost';
import { IRoute } from '../pipe/route.service';
import { IFormatter } from '../formatter/formatter.service';
import { MvcModule } from './mvc.module';

export interface IConfiguration {
    routes?: IRoute[];
    formatters?: IFormatter[];
    formatterDefault?: IFormatter;
}

export var MVC_CONFIGURATION_PROVIDER = 'MVC_CONFIGURATION_PROVIDER';

export function configureMvc(services: IConfigureServices, configuration?: IConfiguration): void {

    const configurationProvider: IProvider = {
        identify: (identifier) => identifier === MVC_CONFIGURATION_PROVIDER,
        get: (ctx) => configuration
    }

    const module = services.injector.get(MvcModule);
    module.injector.providers.push(configurationProvider);
    module.injector.exports.push(configurationProvider);
    
}