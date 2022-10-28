import { Module } from 'providerjs';
import { Authentication } from './authentication.pipe';

@Module({
    providers: [Authentication],
    exports: [Authentication]
})
export class SecurityModule {
}
