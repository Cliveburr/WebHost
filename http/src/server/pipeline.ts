import { IContainer } from 'providerjs';
import { IRequestContext } from './request.context';

export interface IPipeline {
    process(ctx: IRequestContext): Promise<void>;
}

export interface IPipelineConstructor {
    new (container: IContainer): IPipeline;
}

export interface IPipelineDelegate {
    (ctx: IRequestContext): Promise<void>;
}

export type IPipelineType = IPipeline | IPipelineConstructor | IPipelineDelegate;