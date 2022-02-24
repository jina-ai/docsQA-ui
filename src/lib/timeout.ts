import { Defer, TimeoutError } from './defer';

const noop = () => null;

export function timeout<T>(promise: Promise<T>, ttl: number): Promise<T> {

    const deferred = Defer();
    promise.then(deferred.resolve, deferred.reject);

    setTimeout(() => {
        promise.catch(noop);
        deferred.reject(new TimeoutError(`Operation timedout after ${ttl}ms.`));
        if (typeof (promise as any).cancel === 'function') {
            (promise as any).cancel();
        }
    }, ttl);

    return deferred.promise;
}


export function delay(ms: number) {

    const deferred = Defer();
    if (!ms || ms <= 0) {
        deferred.resolve();

        return deferred.promise;
    }

    setTimeout(deferred.resolve, ms, ms);

    return deferred.promise;
}
