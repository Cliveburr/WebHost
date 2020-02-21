import { IContext } from '../server/httpApplication.data';

export interface IPipeline {
    process(ctx: IContext, next: () => void): void;
}

export interface IPipelineConstructor {
    new (): IPipeline;
}

export interface IPipelineDelegate {
    (ctx: IContext, next: () => void): void;
}

export type IPipelineType = IPipelineConstructor | IPipelineDelegate;