import { Host } from '../../../../../src/client';
import { IPathData } from '../../../../../src/shared';

export const Path = (data: IPathData): ClassDecorator => {
  return (cls: Object) => {
      cls['__data__'] = data;
  }
}

export class ClientHub<T> {
  private static __host: Host;

  public call: T;

  public constructor() {
      if (!ClientHub.__host) {
          ClientHub.__host = new Host(this.host_handleError.bind(this));
          ClientHub.__host.connect();
      }
      const data = this['constructor']['__data__'];
      const path = ClientHub.__host.openPath(data, this);
      this.call = path.caller;
  }

  private host_handleError(error?: any): void {
    console.error(error);
  }
}
