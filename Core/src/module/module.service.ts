import { InjectorInstance } from '../provider/injectorInstance';
import { ModuleInstance } from './moduleInstance';

interface ModuleStore {
    cls: Object;
    module: ModuleInstance;
}

export class ModuleService {

    public static instance: ModuleService;

    private modules: ModuleStore[];

    public constructor(
        private injector: InjectorInstance
    ) {
        this.modules = [];
    }

    public get(cls: Object): ModuleInstance {

        let store = this.modules
            .find(m => m.cls === cls);
        
        if (!store) {
            let data = Reflect.getOwnMetadata('module:data', cls);
            
            store = {
                module: new ModuleInstance(data, this.injector),
                cls
            }
            
            this.modules.push(store);
            store.module.generateInstance(cls);
        }

        return store.module;
    }
}