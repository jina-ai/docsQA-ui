let i = 1;

export function debounce(waitMs: number = 1000) {
    return function debounceDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const debounceSymbol = Symbol(`DEBOUNCE:${i++}`);
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of debounce decorator');
        }

        function newFunc(this: any, ...argv: any[]) {
            if (!this[debounceSymbol]) {
                this[debounceSymbol] = {
                    lastRunAt: 0,
                    resultPromise: undefined,
                };
            }
            const conf = this[debounceSymbol];
            if (conf.lastRunAt + waitMs >= Date.now()) {
                return conf.resultPromise;
            }
            conf.lastRunAt = Date.now();
            conf.resultPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const r = func.apply(this, argv);
                        resolve(r);

                        return r;
                    } catch (err) {
                        reject(err);
                    }
                }, waitMs);
            });

            return conf.resultPromise;
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
