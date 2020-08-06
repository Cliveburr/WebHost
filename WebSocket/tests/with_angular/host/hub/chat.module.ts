import { Module } from 'providerjs';
import { ChatServerHub } from './chathub';

@Module({
    providers: [ChatServerHub],
    exports: [ChatServerHub]
})
export default class ChatModule {

}