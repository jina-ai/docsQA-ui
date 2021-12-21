export interface Deferred<T> {
    promise: Promise<T>;
    resolve: (data?: T | Promise<T> | void) => void;
    reject: (err?: any | void) => void;
}
export declare function Defer<T = any>(): Deferred<T>;
export declare class TimeoutError extends Error {
    code: string;
}
export declare function TimedDefer<T = any>(timeout?: number): Deferred<T>;
