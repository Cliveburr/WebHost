import 'reflect-metadata';
import { ModuleInstance, ModuleData } from '../module/moduleInstance';
import { Injector } from '../provider/injectorInstance';
import { ModuleService } from '../module/module.service';
import { DefinedProvider } from '../provider/providers';

export interface ApplicationData extends ModuleData {
}

export class AppInstance extends ModuleInstance {

    protected static instance: AppInstance;

    public constructor(
        data: ApplicationData,
        cls: Object
    ) {
        super(<any>null);

        this.injector = new Injector(this);
        ModuleService.instance = new ModuleService(this.injector);

        this.defineCustomData(data);
        this.generate(data, cls);
    }

    public static generate(data: ApplicationData, cls: Object): void {
        if (AppInstance.instance) {
            throw 'Only one application is allow for execution!';
        }
        AppInstance.instance = new AppInstance(data, cls);

        //let injector = new Injector(AppInstance.instance);
        //AppInstance.instance.injector = injector;
        //ModuleService.instance = new ModuleService(injector);

        //AppInstance.defineCustomData(data, injector);
        //AppInstance.instance.generate(data);
        //AppInstance.instance.generateInstance(cls);
    }

    protected defineCustomData(data: ApplicationData): void {
        if (!data.providers) {
            data.providers = [];
        }
        
        data.providers.push(new DefinedProvider(Injector, this.injector));
    }
}