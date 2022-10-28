import { IPipelineType } from './pipeline';
import { IConfigure } from './httpApplication.data';

export class Configure implements IConfigure {

    public constructor(
        private pipes: IPipelineType[]
    ) {
    }

    public use(pipe: IPipelineType): void {
        this.pipes.push(pipe);
    }
}