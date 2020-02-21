import { IPipelineType, NotFound } from '../pipe';
import { IConfigure } from './httpApplication.data';

export class Configure implements IConfigure {

    public constructor(
        private pipes: IPipelineType[]
    ) {
    }

    public use(pipe: IPipelineType): void {
        this.pipes.push(pipe);
    }
    
    public useErrorNotFound(): void {
        this.pipes.push(NotFound);
    }
}