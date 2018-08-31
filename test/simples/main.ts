import { Application, Injectable } from 'webhost';
import { OneModule, ExportedService } from './oneModule';
import { TwoService } from './twoModule';


@Injectable()
export class DependencieService {
    public someValue = 'value inside';
}

@Injectable()
export class TestService {

    public constructor(
        private dependencie: DependencieService
    ) {
    }

    public getValue(): string {
        return this.dependencie.someValue;
    }
}

@Application({
    imports: [OneModule],
    providers: [TestService, DependencieService]
})
export class TestApplication {

    public constructor(
        testService: TestService,
        exportedService: ExportedService,
        twoService: TwoService
    ) {
        console.log('app started', testService.getValue());

        console.log('ExportedService: ' + exportedService.value);

        console.log('data exported across modules: ' + twoService.value);
    }

}