export function throttle(cap: number = 1) {
    let s = 0;

    return function throttleDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of throttle decorator');
        }

        let lastPromise: Promise<any> | undefined;

        function newFunc(this: any, ...argv: any[]) {
            if (s >= cap) {
                return lastPromise;
            }
            s += 1;

            try {
                const r = func.apply(this, argv);
                if (r.then && typeof r.then === 'function') {
                    r.then(
                        () => (s -= 1),
                        () => (s -= 1)
                    );
                    lastPromise = r;
                } else {
                    s -= 1;
                }

                return r;
            } catch (err) {
                s -= 1;
                throw err;
            }
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
