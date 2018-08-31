import { IProviderContainer } from './providerContainer';
import { IProvider } from './providers';
import { Injector } from './injection';

export class InjectorInstance {
    
    private resolving: Object[];

    public constructor(
    ) {
        this.resolving = [];
    }

    public get(container: IProviderContainer, identifier: any): any {

        // TODO: criar um cache de providers já resolvidos para ganhar velocidade
        let resolved = this.resolveProvider(container, identifier);

        // TODO: verificar decorator optional
        if (!resolved) {
            if (identifier === Injector) {
                return new Injector(container, this);
            }

            throw 'Can\'t find provider for identifier: ' + identifier.toString();
        }

        if (resolved.provider.instance) {
            return resolved.provider.instance;
        }
        else
        {
            return resolved.provider.create(new Injector(resolved.container, this));
        }
    }

    public create(container: IProviderContainer, target: Object): any {

        let isResolving = this.resolving.indexOf(target);
        if (isResolving != -1) {
            throw 'Circular dependencie detected on target: ' + target.toString();
        }
        this.resolving.push(target);

        let args = (Reflect.getOwnMetadata('design:paramtypes', target) || []) as any[];

        // TODO: verificar os providers do decorador injectable
        let objs = args
            .map(a => this.get(container, a));

        let obj = new (<ObjectConstructor>target)(...objs);

        let index = this.resolving.indexOf(target);
        this.resolving.splice(index, 1);

        return obj;
    }

    public resolveProvider(container: IProviderContainer, identifier: any): { container: IProviderContainer, provider: IProvider } | undefined {

        if (container.providers) {
            for (let provider of container.providers) {
                if (provider.identify(identifier)) {
                    return {
                        container,
                        provider
                    };
                }
            }
        }

        if (container.imports) {
            for (let containerImpoted of container.imports) {
                let provider = this.resolveImpoted(containerImpoted, identifier);
                if (provider) {
                    return provider;
                }
            }
        }

        return undefined;
    }

    private resolveImpoted(container: IProviderContainer, identifier: any): { container: IProviderContainer, provider: IProvider } | undefined {

        if (container.exports) {
            for (let exported of container.exports) {
                if (this.isProvider(exported)) {
                    if (exported.identify(identifier)) {
                        return {
                            container,
                            provider: exported
                        };
                    }
                }
                else {
                    let provider = this.resolveProvider(exported, identifier);
                    if (provider) {
                        return provider;
                    }
                }
            }
        }

        return undefined;
    }

    public isProvider(value: IProviderContainer | IProvider): value is IProvider {
        return typeof (<IProvider>value).identify !== 'undefined';
    }
}