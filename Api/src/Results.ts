import * as webhost from 'webhost';
import { IHttpResult } from './IApi';

export class OkResult<T> implements IHttpResult  {
    public responseCode: number = 200;

    constructor(
        public data?: T) {
    }
}

export class NoContentResult<T> implements IHttpResult  {
    public responseCode: number = 204;
    public data: any = null;
}

export class NotFoundResult<T> implements IHttpResult  {
    public responseCode: number = 404;

    constructor(
        public data?: T) {
    }
}

export class NotAllowedResult<T> implements IHttpResult  {
    public responseCode: number = 405;

    constructor(
        public data?: T) {
    }
}

export class InternalErrorResult<T> implements IHttpResult  {
    public responseCode: number = 500;
    public data: any;

    constructor(error: TypeError | string) {
        if (typeof(error) === 'string') {
            this.data = {
                message: error
            };
        } else if (error instanceof TypeError) {
            this.data = {
                message: error.message,
                stack: error.stack
            };
        } else {
            this.data = error;
        }
    }
}