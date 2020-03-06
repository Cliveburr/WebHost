import { Controller, HttpGet } from '../../src/controller/controller.decorator';

@Controller()
export default class HomeController {

    public home(): any {
        console.log('home hit');
        return 666;
    }

    public dig(): void {
        console.log('dig hit');
    }

    public async din(): Promise<any> {
        console.log('din hit');

        return new Promise<any>(executor => {
            executor({ 
                valorUm: 1,
                valorDois: 2
            })
        });
    }

    @HttpGet()
    public login(name: string): void {

    }
}