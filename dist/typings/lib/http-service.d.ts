export declare function stringifyErrorLike(err: Error | {
    [k: string]: any;
} | string | null | undefined): string;
export declare type PromiseWithCancel<T> = Promise<T> & {
    cancel: () => void;
};
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
    baseParams?: {
        [k: string]: string | string[];
    };
    baseHeaders?: {
        [k: string]: string | string[];
    };
}
export declare class HTTPServiceError<T extends HTTPServiceRequestOptions = HTTPServiceRequestOptions> extends Error {
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
    });
}
declare type FetchPatch<To> = {
    serial: number;
    config: To;
};
export declare abstract class HTTPService<Tc extends HTTPServiceConfig = HTTPServiceConfig, To extends HTTPServiceRequestOptions = HTTPServiceRequestOptions> extends EventTarget {
    config: Tc;
    protected baseUrl: string;
    baseURL: URL;
    baseOptions: To;
    baseParams: {
        [k: string]: string | string[];
    };
    baseHeaders: {
        [k: string]: string | string[];
    };
    counter: number;
    Error: typeof HTTPServiceError;
    constructor(baseUrl: string, config?: Tc);
    urlOf(pathName: string, queryParams?: any): string;
    __composeOption(...options: Array<To | undefined>): To;
    __request<T = any>(method: string, uri: string, queryParams?: any, _options?: To, ..._moreOptions: Array<To | undefined>): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    __processResponse(options: HTTPServiceRequestOptions, r: Response): Promise<any>;
    getWithSearchParams<T = any>(uri: string, searchParams?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    get<T = any>(uri: string, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postFormWithSearchParams<T = any>(uri: string, searchParams?: any, data?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postForm<T = any>(uri: string, data?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postMultipartWithSearchParams<T = any>(uri: string, searchParams?: any, multipart?: Array<[string, any, string?]>, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postMultipart<T = any>(uri: string, multipart?: Array<[string, any, string?]>, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postJsonWithSearchParams<T = any>(uri: string, searchParams?: any, data?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    postJson<T = any>(uri: string, data?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    deleteWithSearchParams<T = any>(uri: string, searchParams?: any, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
    delete<T = any>(uri: string, options?: To): PromiseWithCancel<Response & {
        data: T;
    } & FetchPatch<To>>;
}
export interface HTTPService {
    addEventListener(name: 'request', listener: (config: HTTPServiceRequestOptions, serial: number) => void, options: AddEventListenerOptions): this;
    addEventListener(name: 'response', listener: (response: Response & FetchPatch<HTTPServiceRequestOptions>, serial: number) => void, options: AddEventListenerOptions): this;
    addEventListener(name: 'exception', listener: (error: HTTPServiceError, response: (Response & FetchPatch<HTTPServiceRequestOptions>) | undefined, serial: number) => void, options: AddEventListenerOptions): this;
    addEventListener(name: 'parsed', listener: (parsed: any, response: Response & FetchPatch<HTTPServiceRequestOptions> & {
        data: any;
    }, serial: number) => void, options: AddEventListenerOptions): this;
    addEventListener(event: string | symbol, listener: (...args: any[]) => void, options: AddEventListenerOptions): this;
}
export declare type HTTPServiceResponse<T> = Response & {
    data: T;
};
export {};
