let i = 1;

export function throttle(cap: number = 1) {
    return function throttleDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const throttleSymbol = Symbol(`THROTTLE:${i++}`);

        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of throttle decorator');
        }

        function newFunc(this: any, ...argv: any[]) {
            if (!this[throttleSymbol]) {
                this[throttleSymbol] = {
                    s: 0,
                    lastPromise: undefined,
                };
            }
            const conf = this[throttleSymbol];
            if (conf.s >= cap) {
                return conf.lastPromise;
            }
            conf.s += 1;

            try {
                const r = func.apply(this, argv);
                if (r.then && typeof r.then === 'function') {
                    r.then(
                        () => (conf.s -= 1),
                        () => (conf.s -= 1)
                    );
                    conf.lastPromise = r;
                } else {
                    conf.s -= 1;
                }

                return r;
            } catch (err) {
                conf.s -= 1;
                throw err;
            }
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
