import * as http from 'http';
import { IProvider, InjectorContext } from 'providerjs';

export var WS_SESSION_PROVIDER = 'WS_SESSION_PROVIDER';

export interface ISessionContext {
    guid: string;
    request: http.IncomingMessage;
}

export class SessionProvider implements IProvider {
    
    public constructor(
        public cls: Object
    ) {
    }

    public identify(identifier: any): boolean {
        return identifier === WS_SESSION_PROVIDER;
    }

    public get(context: InjectorContext): any {
        return {
            cls: this.cls,
            instance: context.create(this.cls)
        };
    }
}
