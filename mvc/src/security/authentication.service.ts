import { Injectable, InjectorContext, IProvider } from "providerjs";
import { IContext } from "webhost";

export class Identity {
}

class AuthenticationServiceProvider implements IProvider {

    private inst?: Object;

    constructor(
        private cls: any
    ) {
    }

    public identify(identifier: any): boolean {
        return identifier === this.cls || identifier === AuthenticationService;
    }

    public get(context: InjectorContext): any {
        if (!this.inst) {
            this.inst = context.create(this.cls);
        }
        return this.inst;
    }
}

@Injectable()
export class AuthenticationService {
    
    public authenticate(ctx: IContext): Promise<Identity | undefined> {
        throw 'Not implemented!';
    };

    public static providerFor(cls: any): IProvider {
        return new AuthenticationServiceProvider(cls);
    }
}