import { Injectable, Module, Injector } from 'webhost';

@Injectable()
export class TwoService {
    public value = 'TwoService';

    public constructor(
        injector: Injector
    ) {
        let createByInjector = injector.get(ClassInjectable) as ClassInjectable;
        console.log('class not injectable, created: ' + createByInjector.getInternalValue());
    }
}

@Injectable()
export class TwoInternalService {
    public value = 'TwoInternalService';
}

@Injectable()
export class ClassInjectable {

    public constructor(
        private twoInternalService: TwoInternalService
    ) {
    }

    public getInternalValue(): string {
        return this.twoInternalService.value;
    }
}

@Module({
    imports: [],
    providers: [TwoService, TwoInternalService, ClassInjectable],
    exports: [TwoService]
})
export class TwoModule {

}