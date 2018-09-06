import { Injector, InjectorContext } from './injectorInstance';

export interface IProvider {
    identify: (identifier: any) => boolean;
    instance: any;
    create: (context: InjectorContext) => any;
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

    public create(context: InjectorContext): any {
        if (!this.instance) {
            this.instance = context.create(this.refer);
        }
        return this.instance;
    }
}

export class DefinedProvider implements IProvider {

    public constructor(
        private refer: any,
        public instance: any
    ) {
    }

    public identify(identifier: any): boolean {
        return this.refer === identifier;
    }

    public create(): any {
        throw 'Unnecessary create method called!';
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

    public create(context: InjectorContext): any {
        return context.create(this.refer);
    }
}