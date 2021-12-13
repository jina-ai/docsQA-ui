import defaultsDeep from 'lodash-es/defaultsDeep';
import defaults from 'lodash-es/defaults';
import merge from 'lodash-es/merge';

export function stringifyErrorLike(err: Error | { [k: string]: any; } | string | null | undefined) {
    if (!err) {
        return 'null';
    }

    if (typeof err === 'string') {
        return err;
    }

    if (err instanceof Error) {
        return err.toString();
    }

    return JSON.stringify(err, null, 2);
}

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

export type PromiseWithCancel<T> = Promise<T> & { cancel: () => void; };

export interface HTTPServiceRequestOptions extends RequestInit {
    url?: string;
    raw?: boolean;
    responseType?: 'json' | 'stream' | 'text' | 'blob';
}

export interface HTTPServiceConfig {
    requestOptions?: HTTPServiceRequestOptions;

    protocol?: 'http' | 'https';
    hostName?: string;
    port?: number;
    baseUri?: string;

    baseParams?: { [k: string]: string | string[]; };
    baseHeaders?: { [k: string]: string | string[]; };
}

export class HTTPServiceError<T extends HTTPServiceRequestOptions = HTTPServiceRequestOptions> extends Error {
    err?: Error;
    serial: number;
    status?: string | number;
    config?: T;
    response?: Response;
    constructor(serial: number, options?: {
        err?: Error;
        status?: string | number;
        config?: T;
        response?: Response;
    }) {
        super(`Req(${serial}): ${options?.err?.message}`);
        this.serial = serial;
        if (options) {
            Object.assign(this, options);
        }
        this.message = `Req(${serial} ${(this.config?.method || 'get').toUpperCase()} ${this.config?.url}): ${stringifyErrorLike(this.err)}`;
        if (this.err?.stack && this.stack) {
            const message_lines = (this.message.match(/\n/g) || []).length + 1;
            this.stack = this.stack.split('\n').slice(0, message_lines + 1).join('\n') +
                '\n\nWhich was derived from:\n\n' +
                this.err.stack;
        }
    }
}

type FetchPatch<To> = {
    serial: number;
    config: To;
};

export abstract class HTTPService<
    Tc extends HTTPServiceConfig = HTTPServiceConfig,
    To extends HTTPServiceRequestOptions = HTTPServiceRequestOptions
    > extends EventTarget {
    config: Tc;

    protected baseUrl: string;
    baseURL: URL;
    baseOptions: To;

    baseParams: { [k: string]: string | string[]; };
    baseHeaders: { [k: string]: string | string[]; };

    counter: number = 0;

    // tslint:disable-next-line:variable-name
    Error: typeof HTTPServiceError = HTTPServiceError;

    constructor(baseUrl: string, config: Tc = {} as any) {
        super();
        this.config = defaults(config, {
            requestOptions: {
                mode: 'cors',
            },
            baseParams: {},
            baseHeaders: {},
        });

        this.baseUrl = baseUrl;
        this.baseURL = new URL(baseUrl);

        this.baseOptions = defaultsDeep(config.requestOptions, {
            maxRedirects: 0,
            timeout: 1000 * 60 * 0.5,
        });

        this.baseParams = this.config.baseParams!;
        this.baseHeaders = this.config.baseHeaders!;
    }

    urlOf(pathName: string, queryParams: any = {}) {
        const params = new URLSearchParams(this.baseParams as any);
        for (const [k, v] of Object.entries<any>(queryParams || {})) {
            if (Array.isArray(v)) {
                if (v.length) {
                    for (const y of v) {
                        params.append(k, y);
                    }
                } else {
                    params.append(k, '');
                }
            } else {
                params.set(k, v === undefined || v === null || (typeof v === 'number' && isNaN(v)) ? '' : v);
            }
        }

        const pString = params.toString();
        const url = new URL(pString ? `${pathName}?${pString}` : pathName, this.baseUrl);

        url.pathname = `${this.baseURL.pathname}${url.pathname}`.replace(/^\/+/, '/');

        return url.toString();
    }

    __composeOption(...options: Array<To | undefined>): To {
        const finalOptions: any = merge({}, this.baseOptions, ...options);

        return finalOptions;
    }

    __request<T = any>(
        method: string,
        uri: string,
        queryParams?: any,
        _options?: To,
        ..._moreOptions: Array<To | undefined>
    ): PromiseWithCancel<Response & { data: T; } & FetchPatch<To>> {
        const abortCtrl = new AbortController();
        const url = this.urlOf(uri, queryParams);
        const options = this.__composeOption(
            {
                method: method as any,
                signal: abortCtrl.signal,
            } as any,
            _options,
            ..._moreOptions
        );

        if (options.responseType) {
            const headers = new Headers(options.headers);
            options.headers = headers;

            if (!headers.has('Accept')) {
                switch (options.responseType) {
                    case 'json': {
                        headers.set('Accept', 'application/json');
                        break;
                    }

                    case 'text':
                    case 'stream':
                    case 'blob':
                    default: {
                        headers.set('Accept', '*/*');
                        break;
                    }
                }
            }
        }

        const deferred = Defer();
        (deferred.promise as any).cancel = abortCtrl.abort;
        const serial = this.counter++;
        const config = { ...options, url };
        this.dispatchEvent(new CustomEvent('request', {
            detail: { config, serial }
        }));
        fetch(url, options).then(
            async (r) => {
                Object.defineProperties(r, {
                    serial: { value: serial },
                    config: { value: config },
                });
                this.dispatchEvent(new CustomEvent('response', {
                    detail: { response: r, serial, config },
                }));
                try {
                    const parsed = await this.__processResponse(options, r);
                    Object.defineProperties(r, {
                        data: { value: parsed },
                    });

                    this.dispatchEvent(new CustomEvent('parsed', {
                        detail: { parsed, response: r, serial, config },
                    }));

                    deferred.resolve(r);

                    return;
                } catch (err: any) {
                    const newErr = new this.Error(serial, {
                        err,
                        config,
                        response: r,
                        status: r.status || err.code || err.errno
                    });

                    this.dispatchEvent(new CustomEvent('exception', {
                        detail: { err: newErr, response: r, serial, config }
                    }));

                    deferred.reject(newErr);
                }
            },
            (err: any) => {
                const newErr = new this.Error(serial, {
                    err,
                    config,
                    status: err.code || err.errno
                });

                this.dispatchEvent(new CustomEvent('exception', {
                    detail: { err: newErr, serial, config },
                }));

                deferred.reject(newErr);
            }
        );

        return deferred.promise as any;
    }

    async __processResponse(options: HTTPServiceRequestOptions, r: Response) {
        const contentType = r.headers.get('Content-Type');
        let bodyParsed: any = null;
        do {
            if (options.raw) {
                break;
            }
            if (options.responseType === 'json') {
                bodyParsed = await r.json();
                break;
            } else if (options.responseType === 'text') {
                bodyParsed = await r.text();
                break;
            } else if (options.responseType === 'blob') {
                bodyParsed = r.blob();
                break;
            } else if (options.responseType === 'stream') {
                bodyParsed = r.body;
                break;
            }
            if (contentType?.startsWith('application/json')) {
                bodyParsed = await r.json();
            } else if (contentType?.startsWith('text/')) {
                bodyParsed = await r.text();
            }
            break;
            // eslint-disable-next-line no-constant-condition
        } while (false);

        if (r.ok) {
            return bodyParsed === null ? r : bodyParsed;
        }

        throw bodyParsed === null ? r : bodyParsed;
    }

    getWithSearchParams<T = any>(uri: string, searchParams?: any, options?: To) {
        return this.__request<T>('GET', uri, searchParams, options);
    }
    get<T = any>(uri: string, options?: To) {
        return this.getWithSearchParams<T>(uri, undefined, options);
    }

    postFormWithSearchParams<T = any>(uri: string, searchParams: any = {}, data: any = {}, options?: To) {

        const form = new FormData();
        for (const [k, v] of Object.entries(data)) {
            form.append(k, `${v}`);
        }

        return this.__request<T>(
            'POST',
            uri,
            searchParams,
            {
                body: form,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            } as any,
            options
        );
    }

    postForm<T = any>(uri: string, data: any = {}, options?: To) {
        return this.postFormWithSearchParams<T>(uri, undefined, data, options);
    }

    postMultipartWithSearchParams<T = any>(
        uri: string,
        searchParams: any = {},
        multipart: Array<[string, any, string?]> = [],
        options?: To
    ) {
        const form = new FormData();

        for (const [k, v, o] of multipart) {
            form.append(k, v, o);
        }

        return this.__request<T>(
            'POST',
            uri,
            searchParams,
            { body: form } as any,
            options
        );
    }
    postMultipart<T = any>(
        uri: string,
        multipart: Array<[string, any, string?]> = [],
        options?: To
    ) {
        return this.postMultipartWithSearchParams<T>(uri, undefined, multipart, options);
    }

    postJsonWithSearchParams<T = any>(uri: string, searchParams?: any, data?: any, options?: To) {
        return this.__request<T>(
            'POST',
            uri,
            searchParams,
            {
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            } as any,
            options
        );
    }

    postJson<T = any>(uri: string, data?: any, options?: To) {
        return this.postJsonWithSearchParams<T>(uri, undefined, data, options);
    }

    deleteWithSearchParams<T = any>(uri: string, searchParams?: any, options?: To) {
        return this.__request<T>('DELETE', uri, searchParams, options);
    }
    delete<T = any>(uri: string, options?: To) {
        return this.deleteWithSearchParams<T>(uri, undefined, options);
    }
}
// eslint-disable max-len
export interface HTTPService {
    addEventListener(name: 'request', listener: (config: HTTPServiceRequestOptions, serial: number) => void, options: AddEventListenerOptions): this;

    addEventListener(
        name: 'response',
        listener: (response: Response & FetchPatch<HTTPServiceRequestOptions>, serial: number) => void, options: AddEventListenerOptions
    ): this;
    addEventListener(
        name: 'exception',
        listener: (
            error: HTTPServiceError,
            response: (Response & FetchPatch<HTTPServiceRequestOptions>) | undefined,
            serial: number
        ) => void, options: AddEventListenerOptions
    ): this;
    addEventListener(
        name: 'parsed',
        listener: (
            parsed: any,
            response: Response & FetchPatch<HTTPServiceRequestOptions> & { data: any; },
            serial: number
        ) => void, options: AddEventListenerOptions
    ): this;
    addEventListener(event: string | symbol, listener: (...args: any[]) => void, options: AddEventListenerOptions): this;
}
// eslint-enable max-len

export type HTTPServiceResponse<T> = Response & { data: T; };
