
export class Dictonary<T> {

    private data: { [key: string]: any };
    private dataCount: number;

    public constructor(
    ) {
        this.data = {};
        this.dataCount = 0;
    }

    public get count(): number {
        return this.dataCount;
    }

    public set(key: string, item: T): boolean {
        if (key in this.data) {
            return false;
        }
        else {
            this.data[key] = item;
            this.dataCount++;
            return true;
        }
    }

    public get(key: string): T | undefined {
        if (key in this.data)
            return this.data[key];
        else
            return undefined;
    }

    public has(key: string): boolean {
        return key in this.data;
    }

    public remove(key: string): boolean {
        if (key in this.data) {
            delete this.data[key];
            this.dataCount--;
            return true;
        }
        else {
            return false;
        }
    }

    public toList(): Array<T> {
        return Object.keys(this.data)
            .map(e => this.data[e]);
    }

    public clone(): Dictonary<T> {
        let clone = new Dictonary<T>();
        for (let key of Object.keys(this.data)) {
            clone.set(key, this.data[key]);
        }
        return clone;
    }
}