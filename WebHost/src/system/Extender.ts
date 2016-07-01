interface Array<T> {
    removeAll(element: T): T[];
    remove(element: T): T[];
    has(test: (element: T) => boolean): boolean;
    has(element: T): boolean;
    last(): T;
    filterOne(filter: (item: T) => boolean): T;
    any(): boolean;
    firstOrDefault():T
}

Object.defineProperties(Array.prototype, {
    "removeAll": {
        enumerable: false,
        value: function (element) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == element) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        }
    },
    "remove": {
        enumerable: false,
        value: function (element) {
            var i = this.indexOf(element);
            if (i != -1) this.splice(i, 1);
            return this;
        }
    },
    "has": {
        enumerable: false,
        value: function (test: Object) {
            var func: any = test;
            if (!test.isFunction()) {
                func = function (e) {
                    return e === test;
                };
            }
            for (var i = 0; i < this.length; i++) {
                if (func(this[i])) return true;
            }
            return false;
        }
    },
    "last": {
        enumerable: false,
        value: function () {
            return this[this.length - 1];
        }
    },
    "filterOne": {
        enumerable: false,
        value: function (filter) {
            var f = this.filter(filter);
            if (f.length > 0)
                return f[0];
            else
                return null;
        }
    },
    "any": {
        enumerable: false,
        value: function () {
            return this.length > 0;
        }
    }
});

interface String {
    trim(): string;
    ltrim(): string;
    rtrim(): string;
    sltrim(chars: string): string;
    srtrim(chars: string): string;
    strim(chars: string): string;
    startsWith(prefix: string): boolean;
    endsWith(prefix: string): boolean;
    format(...params: string[]): string;
}

var format = function () {
    var ticks = this.match(/(\{[0-9]+\})/g);
    if (!ticks)
        return this;

    var tr = this;
    for (var i = 0; i < ticks.length; i++) {
        var value: any = /\{([0-9])+\}/.exec(ticks[i])[1];
        tr = tr.replace(ticks[i], arguments[value]);
    }
    return tr;
}

Object.defineProperties(String.prototype, {
    'trim': {
        enumerable: false,
        value: String.prototype.trim || function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    },
    'ltrim': {
        enumerable: false,
        value: function () {
            return this.replace(/^\s+/, '');
        }
    },
    'rtrim': {
        enumerable: false,
        value: function () {
            return this.replace(/\s+$/, '');
        }
    },
    'strim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.sltrim(chars).srtrim(chars);
        }
    },
    'sltrim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.replace(new RegExp('^[' + chars + ']+'), '');
        }
    },
    'srtrim': {
        enumerable: false,
        value: function (chars) {
            if (chars === undefined)
                chars = '\s';
            return this.replace(new RegExp('[' + chars + ']+$'), '');
        }
    },
    'startsWith': {
        enumerable: false,
        value: function (prefix) {
            return this.indexOf(prefix) === 0;
        }
    },
    'endsWith': {
        enumerable: false,
        value: function (suffix) {
            return this.match(suffix + '$') == suffix;
        }
    },
    'format': {
        enumerable: false,
        value: format
    }
});

interface Object {
    isFunction(): boolean;
}

Object.defineProperties(Object.prototype, {
    'isFunction': {
        enumerable: false,
        value: function () {
            return typeof this === "function";
        }
    }
});