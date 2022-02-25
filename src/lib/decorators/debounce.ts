export function debounce(waitMs: number = 1000) {
    let lastRunAt = 0;

    return function debounceDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of debounce decorator');
        }

        let resultPromise: Promise<any> | undefined;

        function newFunc(this: any, ...argv: any[]) {
            if (lastRunAt + waitMs >= Date.now()) {
                return resultPromise;
            }
            lastRunAt = Date.now();
            resultPromise = new Promise((resolve, reject) => {
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

            return resultPromise;
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
