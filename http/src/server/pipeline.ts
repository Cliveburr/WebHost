import { IContext } from './httpApplication.data';

export interface IPipeline {
    process(ctx: IContext, next: () => void): void | Promise<void>;
}

export interface IPipelineConstructor {
    new (...args: any[]): IPipeline;
}

export interface IPipelineDelegate {
    (ctx: IContext, next: () => void): void | Promise<void>;
}

export type IPipelineType = IPipeline | IPipelineConstructor | IPipelineDelegate;