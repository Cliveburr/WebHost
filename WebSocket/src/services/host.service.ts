import { ClientHost } from './clientHost';

export class HostService {
    
    public constructor(
        private clientHost: ClientHost,
        private path: string
    ) {
    }

    public call(method: string, ...args: any[]): void {
        this.clientHost.call(this.path, method, ...args);
    }

    public callr<T>(method: string, ...args: any[]): Promise<T> {
        return this.clientHost.callr(this.path, method, ...args);
    }

    public callAll(method: string, ...args: any[]): void {
        this.clientHost.callAll(this.path, method, ...args);
    }
}