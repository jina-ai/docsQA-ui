import { Defer } from '../defer';

const NOOP = () => undefined;

const DEFAULT_SERIAL_SYMBOL = Symbol('SERIAL_OP');

export function serialOperation(id: symbol = DEFAULT_SERIAL_SYMBOL) {
    return function serialOperationDecorator(_target: any, _propName: string | symbol, propDesc: PropertyDescriptor) {
        const func: Function = propDesc.value;

        if (typeof func !== 'function') {
            throw new Error('Invalid use of serial operation decorator');
        }

        async function serialOperationAwareFunction(this: any, ...argv: any[]) {
            const lastPromise = this[id] as Promise<unknown> | undefined;

            const deferred = Defer<unknown>();

            this[id] = deferred.promise;
            await lastPromise?.then(NOOP, NOOP);

            let result: unknown;
            try {
                result = await func.apply(this, argv);

                deferred.resolve(result);
            } catch (err) {
                deferred.reject(err);
            }

            return deferred.promise;
        }

        // eslint-disable-next-line no-param-reassign
        propDesc.value = serialOperationAwareFunction;

        return propDesc;
    };
}
