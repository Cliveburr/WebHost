import { Module } from 'providerjs';
import { SessionPipe } from '../session/session.pipe';
import { SessionStore } from './session.store';

@Module({
    providers: [SessionPipe, SessionStore],
    exports: [SessionPipe, SessionStore]
})
export class SessionModule {
}
