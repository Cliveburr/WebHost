import { IProviderContainer } from './providerContainer';
import { IProvider } from './providers';

export interface InjectorContext {
    identifier: any;
    create(target: Object): any;
}

export class Injector {
    
    private resolving: Object[];

    public constructor(
        private appContainer: IProviderContainer
    ) {
        this.resolving = [];
    }

    public get(identifier: any, ...customs: IProvider[]): any {

        // TODO: criar um cache de providers já resolvidos para ganhar velocidade
        let provider: IProvider | undefined = undefined;
        if (customs) {
            provider = this.resolveProvider({ providers: customs }, identifier);
        }

        if (!provider) {
            provider = this.resolveProvider(this.appContainer, identifier);
        }

        // TODO: verificar decorator optional
        if (!provider) {
            throw 'Can\'t find provider for identifier: ' + identifier.toString();
        }

        if (provider.instance) {
            return provider.instance;
        }
        else
        {
            return provider.create({
                identifier,
                create: (target: Object) => this.create(target, ...customs)
            });
        }
    }

    public create(target: Object, ...customs: IProvider[]): any {

        let isResolving = this.resolving.indexOf(target);
        if (isResolving != -1) {
            throw 'Circular dependencie detected on target: ' + target.toString();
        }
        this.resolving.push(target);

        let args = (Reflect.getOwnMetadata('design:paramtypes', target) || []) as any[];

        // TODO: verificar os providers do decorador injectable
        let objs = args
            .map(a => this.get(a, ...customs));

        let obj = new (<ObjectConstructor>target)(...objs);

        let index = this.resolving.indexOf(target);
        this.resolving.splice(index, 1);

        return obj;
    }

    public resolveProvider(container: IProviderContainer, identifier: any): IProvider | undefined {

        if (container.providers) {
            for (let provider of container.providers) {
                if (provider.identify(identifier)) {
                    return provider;
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

    private resolveImpoted(container: IProviderContainer, identifier: any): IProvider | undefined {

        if (container.exports) {
            for (let exported of container.exports) {
                if (this.isProvider(exported)) {
                    if (exported.identify(identifier)) {
                        return exported;
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