import { Injectable/*, ModuleHotImport*/ } from 'providerjs';
import { WS_PATH_LOADER_PROVIDER, IPathLoader } from '../../../src';

import { ChatServerHub } from './hub/chathub';

@Injectable({
    identity: WS_PATH_LOADER_PROVIDER
})
export class SimpleLoader implements IPathLoader {
    
    public constructor(
        //private hotload: ModuleHotImport
    ) {
    }

    public getPath(pathName: string): Object | undefined {
        switch (pathName) {
            case 'chat': {
                //const file = require('./hub/chathub');
                //this.hotload.import(file.ChatModule);
                //return file.ChatServerHub;
                return ChatServerHub;
            }
            default: return undefined;
        }
    }
}
