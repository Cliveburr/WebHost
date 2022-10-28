import { Application } from 'providerjs';

@Application({
    imports: [],
    providers: [],
    exports: []
})
export class MainApp {

    public constructor(
    ) {
        alert('dig');
    }
}
