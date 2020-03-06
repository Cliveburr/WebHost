import { IConfigureServices } from 'webhost';
import { IProviderContainer, IProvider } from 'providerjs';
import { IRoute } from '../pipe/route.service';
import { IFormatter } from '../formatter/formatter.service';

export interface IConfiguration {
    routes?: IRoute[];
    formatters?: IFormatter[];
    formatterDefault?: IFormatter;
}

export var MVC_CONFIGURATION_PROVIDER = 'MVC_CONFIGURATION_PROVIDER';

export function configureMvc(services: IConfigureServices, configuration?: IConfiguration): void {

    const container: IProviderContainer = {
        providers: [],
        exports: []
    };

    const configurationProvider: IProvider = {
        identify: (identifier) => identifier === MVC_CONFIGURATION_PROVIDER,
        get: (ctx) => configuration
    }
    container.providers?.push(configurationProvider);
    container.exports?.push(configurationProvider);
    
    services.injector.rootContainer.imports?.push(container);
}