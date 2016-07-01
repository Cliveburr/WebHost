
module internal {
    export class Event<T> {
        private _events: Array<T>;
        public raise: T;

        constructor() {
            this._events = new Array<T>();
            this.raise = <any>this._raise;
        }

        private _raise(...args: any[]): void {
            this._events.forEach((e: T) => {
                var toCall: any = e;
                toCall.apply(toCall, args);
            });
        }

        public add(fun: T): void {
            this._events.push(fun);
        }

        public remove(fun: T): boolean {
            var i = this._events.indexOf(fun);
            if (i == -1) return false;
            this._events.splice(i, 1);
            return true;
        }
    }
}

export = internal;