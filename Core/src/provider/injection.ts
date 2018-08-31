import { IProviderContainer } from './providerContainer';
import { InjectorInstance } from './injectorInstance';

export class Injector {

    public constructor(
        private container: IProviderContainer,
        private instance: InjectorInstance
    ) {
    }

    public get(identifier: any): any {
        return this.instance.get(this.container, identifier);
    }

    public create(target: Object): any {
        return this.instance.create(this.container, target);
    }
}