let i = 1;

export function runOnce() {
    const runOnceSymbol = Symbol(`RUN_ONCE:${i++}`);

    return function runOnceDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of runOnce decorator');
        }

        function newFunc(this: any, ...argv: any[]) {
            const conf = this[runOnceSymbol];
            if (conf) {
                if (conf.hasOwnProperty('thrown')) {
                    throw conf.thrown;
                }

                return conf.result;
            }

            const conf2: any = {};
            this[runOnceSymbol] = conf2;

            try {
                conf2.result = func.apply(this, argv);

                return conf2.result;
            } catch (err) {
                conf2.thrown = err;
                throw err;
            }
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
