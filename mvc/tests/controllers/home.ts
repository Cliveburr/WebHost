import { Controller, HttpGet, HttpPost, Authorization, AllowAnonymous, Identity, Authorize } from '../../src';
import { IdentitySession, SessionService } from '../service/session-security.service';

function checkIsAdmin(identity: IdentitySession): boolean {
    return identity.isAdmin;
}

@Controller()
@Authorization()
export default class HomeController {

    public constructor(
        private sessionService: SessionService,
        private identity: IdentitySession
    ) {
        if (identity) {
            console.log('Access of: ' + identity.index)
        }
    }

    @AllowAnonymous()
    @HttpGet('/home/{v2}/{v1}')
    public homeGet(v1: number, v2: string): any {
        console.log('home hit get', v1);
        return 666;
    }

    @HttpPost('/home/{v1}')
    public homePost(v1: number, model: any): any {
        console.log('home hit post', v1, model);
        return 777;
    }

    @HttpGet('/admin')
    @Authorize(checkIsAdmin)
    public onlyAdmin(): string {
        return 'isAdmin';
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

    @AllowAnonymous()
    @HttpGet('/login/{admin}')
    public login(admin: string): { 'session-header': string } {
        // if (this.session) {
        //     throw 'Already login!';
        // }
        // else {
            var identity = this.sessionService.login(admin);
            console.log('login of: ' + identity);
            return { 'session-header': identity.sessionHeader };
        //}
    }

    // public logoff(): void {
    //     console.log('logoff of: ' + this.session.data?.name);

    //     if (this.session) {
    //         this.store.remove(this.session.sessionId);
    //     }
    // }
}