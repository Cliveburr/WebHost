import { Controller, HttpGet } from '../../src/controller/controller.decorator';
import { SessionStore } from '../../src/session/session.store';
import { Session } from '../../src/session/session';

interface MySessionData {
    name: string;
}

@Controller()
export default class HomeController {

    public constructor(
        private store: SessionStore,
        private session: Session<MySessionData>,
    ) {
        if (session) {
            console.log('Access of: ' + session.data?.name)
        }
    }

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

    public login(name: string): { 'session-id': string } {
        if (this.session) {
            throw 'Already login!';
        }
        else {
            console.log('login of: ' + name);
            const session = this.store.createNew<MySessionData>();
            session.data = {
                name
            }
            return { 'session-id': session.sessionId };
        }
    }

    public logoff(): void {
        console.log('logoff of: ' + this.session.data?.name);

        if (this.session) {
            this.store.remove(this.session.sessionId);
        }
    }
}