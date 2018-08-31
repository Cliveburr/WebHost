import 'reflect-metadata';
import { ModuleInstance, ModuleData } from '../module/moduleInstance';
import { InjectorInstance } from '../provider/injectorInstance';
import { ModuleService } from '../module/module.service';

export interface ApplicationData extends ModuleData {
}

export class AppInstance extends ModuleInstance {

    protected static instance: AppInstance;

    public constructor(
        data: ApplicationData,
        injector: InjectorInstance
    ) {
        super(data, injector);
    }

    public static generate(data: ApplicationData, cls: Object): void {
        if (AppInstance.instance) {
            throw 'Only one application is allow for execution!';
        }

        let injector = new InjectorInstance();
        ModuleService.instance = new ModuleService(injector);
        this.defineCustomData(data);
        
        AppInstance.instance = new AppInstance(data, injector);
        AppInstance.instance.generateInstance(cls);
    }

    protected static defineCustomData(data: ApplicationData): void {
        //injector.rootProviders.push(new StaticProvider(this.injector));

        
    }
}