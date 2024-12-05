import { Dictonary } from './dictonary';

export class GuidDictonary<T> extends Dictonary<T> {
    
    public chars: string;
    public lenght: number;

    public constructor(
        chars?: string,
        lenght?: number
    ) {
        super();
        this.chars = chars || 'asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0123456789';
        this.lenght = lenght || 10;
    }

    public getFreeGuid(): string {
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
        let id = this.getFreeGuid();
        this.set(id, item);
        return id;
    }
}