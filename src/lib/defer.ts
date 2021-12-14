export interface Deferred<T> {
    promise: Promise<T>;
    resolve: (data?: T | Promise<T> | void) => void;
    reject: (err?: any | void) => void;
}

export function Defer<T = any>(): Deferred<T> {
    const self: any = {};
    self.promise = new Promise<T>((resolve, reject) => {
        self.resolve = resolve;
        self.reject = reject;
    });
    Object.freeze(self);

    return self;
}

export class TimeoutError extends Error {
    code = 'ETIMEDOUT';
}

// eslint-disable-next-line no-magic-numbers
export function TimedDefer<T = any>(timeout: number = 5000): Deferred<T> {
    const self: any = {};

    self.promise = new Promise<T>((resolve, reject) => {
        let timeoutHandle: NodeJS.Timer | null = setTimeout(() => {
            self.reject(new TimeoutError(`Timed out after ${timeout}ms.`));
        }, timeout);

        self.resolve = (stuff: any) => {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }

            return resolve(stuff);
        };
        self.reject = (...argv: any[]) => {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }

            return reject(...argv);
        };
    });

    Object.freeze(self);

    return self;
}
