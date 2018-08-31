import { Module, Injectable } from 'webhost';
import { TwoModule, TwoService } from './twoModule';

@Injectable()
export class OneService {
    public value = 'OneService';
}

@Injectable()
export class ExportedService {
    public value = 'ExportedService';
}



@Module({
    imports: [TwoModule],
    providers: [OneService, ExportedService],
    exports: [TwoModule, ExportedService]
})
export class OneModule {


    public constructor(
        twoService: TwoService
    ) {
        console.log('OneModule constructor: TwoService: ' + twoService.value);
    }
}