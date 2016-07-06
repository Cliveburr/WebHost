
export class Dictonary<T> {
    private _data: any = {};
    private _count: number = 0;
    get count() { return this._count; }

    public set(id: string, item: T): boolean {
        if (id in this._data) {
            return false;
        }
        else {
            this._data[id] = item;
            this._count++;
            return true;
        }
    }

    public get(id: string): T {
        if (id in this._data)
            return this._data[id];
        else
            return null;
    }

    public has(id: string): boolean {
        return id in this._data;
    }

    public remove(id: string): boolean {
        if (id in this._data) {
            delete this._data[id];
            this._count--;
            return true;
        }
        else {
            return false;
        }
    }

    public toList(): Array<T> {
        return Object.keys(this._data).map((e: string) => {
            return this._data[e];
        });
    }
}

export class AutoDictonary<T> extends Dictonary<T> {
    constructor(
        public chars: string,
        public lenght: number) {
        super();
    }

    public generateID = (): string => {
        let tr: string;
        do {
            tr = "";
            for (let i = 0; i < this.lenght; i++) {
                tr += this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        } while (this.has(tr));
        return tr;
    }

    public autoSet(item: T): string {
        let id = this.generateID();
        this.set(id, item);
        return id;
    }
}