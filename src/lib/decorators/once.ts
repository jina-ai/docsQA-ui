const NOT_RUN = Symbol('NOT RUN');

export function runOnce() {
    return function runOnceDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of runOnce decorator');
        }

        let result: any = NOT_RUN;
        let thrown: any = NOT_RUN;

        function newFunc(this: any, ...argv: any[]) {
            if (thrown !== NOT_RUN) {
                throw thrown;
            }
            if (result !== NOT_RUN) {
                return result;
            }
            try {
                result = func.apply(this, argv);

                return result;
            } catch (err) {
                thrown = err;
                throw err;
            }
        }

        propDesc.value = newFunc;

        return propDesc;
    };
}
