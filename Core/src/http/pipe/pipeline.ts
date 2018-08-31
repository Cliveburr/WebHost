import { IContext } from '../server/context';

export interface IPipeline {
    process(ctx: IContext, next: () => void): void;
}

export interface IPipelineConstructor {
    new (): IPipeline;
}

export type IPipelineType = IPipelineConstructor | ((ctx: IContext, next: () => void) => void);