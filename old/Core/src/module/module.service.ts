import { Injector } from '../provider/injectorInstance';
import { ModuleInstance } from './moduleInstance';

interface ModuleStore {
    cls: Object;
    module: ModuleInstance;
}

export class ModuleService {

    public static instance: ModuleService;

    private modules: ModuleStore[];

    public constructor(
        private injector: Injector
    ) {
        this.modules = [];
    }

    public get(cls: Object): ModuleInstance {

        let store = this.modules
            .find(m => m.cls === cls);
        
        if (!store) {
            let isModule = Reflect.getOwnMetadata('module:is', cls);
            if (!isModule) {
                throw 'Invalid module! ' + cls.toString();
            }

            let data = Reflect.getOwnMetadata('module:data', cls);
            
            store = {
                module: new ModuleInstance(this.injector),
                cls
            }
            
            this.modules.push(store);
            store.module.generate(data, cls);
        }

        return store.module;
    }
}