import { IConfigure } from './app.data';
import { IPipelineType } from '../pipe/pipeline';

export class Configure {

    public pipes: IPipelineType[];

    public constructor(
    ) {
        this.pipes = [];
    }

    public safeUser(): IConfigure {
        return {
            use: this.use.bind(this),
            useErrorNotFound: this.useErrorNotFound.bind(this),
            debug: this.debug.bind(this)
        };
    }

    private use(pipe: IPipelineType): void {
        this.pipes.push(pipe);
    }
    
    private useErrorNotFound(): void {
    }

    private debug(): void {
    }
}