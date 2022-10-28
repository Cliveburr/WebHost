import { Module } from 'providerjs';
import { NotFound } from './notfound.pipe';
import { DefaultFiles } from './defaultfiles.pipe';
import { StaticFiles } from './staticfiles.pipe';

const ALL_PIPES = [
    NotFound,
    DefaultFiles,
    StaticFiles
];

@Module({
    providers: [ALL_PIPES],
    exports: [ALL_PIPES]
})
export class FileModule {
}
