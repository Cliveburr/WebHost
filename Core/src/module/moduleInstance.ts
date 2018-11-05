import { IProvider, StaticProvider } from '../provider/providers';
import { Injector } from '../provider/injectorInstance';
import { IProviderContainer } from '../provider/providerContainer';
import { ModuleService } from './module.service';

export class ModuleData {
    imports?: Array<ImportType> | undefined;
    providers?: Array<ProviderType> | undefined;
    exports?: Array<ExportType> | undefined;
}

export type ImportType = Object | Array<Object>;
export type ProviderType = Object | IProvider | Array<Object | IProvider>;
export type ExportType = Object | IProvider | Array<Object | IProvider>;

export class ModuleInstance implements IProviderContainer {

    public instance: any;
    public providers?: IProvider[];
    public imports?: IProviderContainer[];
    public exports?: Array<IProviderContainer | IProvider>;

    public constructor(
        protected injector: Injector
    ) {
    }

    public generate(data: ModuleData, cls: Object): void {
        this.generateImports(data.imports);
        this.generateProviders(data.providers);
        this.generateExports(data.exports);
        this.generateInstance(cls);
    }

    private generateImports(imports: Array<ImportType> | undefined): void {
        if (imports) {
            let newImports: any = [];
            this.generateImportsRecur(newImports, imports);
            this.imports = newImports;
        }
    }

    private generateImportsRecur(array: IProviderContainer[], imports: Array<ImportType>): void {
        for (let impt of imports) {
            if (Array.isArray(impt)) {
                this.generateImportsRecur(array, impt);
            }
            else {
                array.push(ModuleService.instance.get(impt));
            }
        }
    }

    private generateExports(expts: Array<ExportType> | undefined): void {
        if (expts) {
            let newExports: any = [];
            this.generateExportsRecur(newExports, expts);
            this.exports = newExports;
        }
    }

    private generateExportsRecur(array: Array<IProviderContainer | IProvider>, expots: Array<ExportType>): void {
        for (let expt of expots) {
            if (Array.isArray(expt)) {
                this.generateExportsRecur(array, expt);
            }
            else {
                if (this.injector.isProvider(expt)) {
                    array.push(expt);
                }
                else {
                    let provider = this.injector.resolveProvider(this, expt);
                    if (provider) {
                        array.push(provider);
                    }
                    else {
                        array.push(ModuleService.instance.get(expt));
                    }
                }
            }
        }
    }

    private generateProviders(providers: Array<ProviderType> | undefined): void {
        if (providers) {
            let newProviders: any = [];
            this.generateProvidersRecur(newProviders, providers);
            this.providers = newProviders;
        }
    }

    private generateProvidersRecur(array: IProvider[], providers: Array<ProviderType>): void {
        for (let provider of providers) {
            if (Array.isArray(provider)) {
                this.generateProvidersRecur(array, provider);
            }
            else {
                if (this.injector.isProvider(provider)) {
                    array.push(provider);
                }
                else {
                    let isInjectable = Reflect.getOwnMetadata('injectable:is', provider);
                    if (typeof isInjectable == 'undefined') {
                        throw 'Injectable class need to be defined with Injectable decorator!';
                    }

                    if (isInjectable) {
                        let providerInstance = this.createProviderFromObject(provider);
                        if (array.indexOf(providerInstance) == -1) {
                            array.push(providerInstance);
                        }
                    }
                }
            }
        }
    }

    private generateInstance(cls: Object): void {
        this.instance = this.injector.create(cls);
    }

    private createProviderFromObject(cls: Object): IProvider {

        let data = Reflect.getOwnMetadata('injectable:data', cls);
        if (data) {
            //TODO: usar as informações para configurar seus providers
        }

        let provider = Reflect.getOwnMetadata('injectable:provider', cls);   //TODO: se tiver provider, como proceder?
        if (!provider) {
            provider = new StaticProvider(cls);
        }

        return provider;
    }
}