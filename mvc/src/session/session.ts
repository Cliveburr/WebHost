
export class Session<T> {

    public data?: T;

    public constructor(
        public sessionId: string
    ) {
    }
}