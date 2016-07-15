import * as webhost from 'webhost';
import * as results from './Results';
import { IController, IHttpResult } from './IApi';

export class Controller implements IController {
    public context: webhost.IContext;
    public response: (result: IHttpResult) => void;

    public notAllowed<T>(data?: T): IHttpResult {
        return new results.NotAllowedResult(data);
    }

    public ok<T>(data: T): IHttpResult {
        return new results.OkResult(data);
    }

    public okNoContent(): IHttpResult {
        return new results.NoContentResult();
    }

    public notFound<T>(data?: T): IHttpResult {
        return new results.NotFoundResult(data);
    }

    public internalError(data?: TypeError): IHttpResult {
        return new results.InternalErrorResult(data);
    }
}