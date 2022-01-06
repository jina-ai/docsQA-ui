const NOT_RUN = Symbol('NOT RUN');

const tickFunction = setTimeout;

export function perTick() {
    return function perTickDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of perTick decorator');
        }

        let tickActive = false;
        let lastResult: any = NOT_RUN;
        let lastThrown: any = NOT_RUN;

        function newFunc(this: any, ...argv: any[]) {
            if (tickActive) {
                if (lastThrown !== NOT_RUN) {
                    throw lastThrown;
                }

                return lastResult;
            }

            tickActive = true;
            tickFunction(() => (tickActive = false));
            try {
                lastResult = func.apply(this, argv);

                return lastResult;
            } catch (err) {
                lastThrown = err;
                throw err;
            }
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}

export function perNextTick() {
    return function perTickDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of perNextTick decorator');
        }

        let tickActive = false;

        function newFunc(this: any, ...argv: any[]) {
            if (tickActive) {
                return;
            }

            tickActive = true;
            tickFunction(() => {
                tickActive = false;

                try {
                    func.apply(this, argv);
                } catch (err) {
                    throw err;
                }
            });
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
