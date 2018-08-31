import { Injector } from './injection';

export interface IProvider {
    identify: (identifier: any) => boolean;
    instance: any;
    create: (injector: Injector) => any;
}

export class StaticProvider implements IProvider {
    
    public instance: any;

    public constructor(
        private refer: any  // TODO: como funcionaria para objetos diferente de ObjectConstructor, tipo string ou Symbol
    ) {
    }

    public identify(identifier: any): boolean {
        return this.refer === identifier;
    }

    public create(injector: Injector): any {
        if (!this.instance) {
            this.instance = injector.create(this.refer);
        }
        return this.instance;
    }
}

export class AsRequestProvider implements IProvider {

    public instance: any;

    public constructor(
        private refer: any
    ) {
    }

    public identify(identifier: any): boolean {
        return this.refer === identifier;
    }

    public create(injector: Injector): any {
        return injector.create(this.refer);
    }
}