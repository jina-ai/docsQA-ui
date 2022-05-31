import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';
export interface JinaServerEnvelope<T = DocumentArray> {
    data: T;
    header: {
        execEndpoint: string;
        requestId: string;
        status?: {
            code: number;
            description: string;
            exception?: {
                name: string;
                executor?: string;
                args?: string;
                stacks?: string[];
            };
        };
        targetExecutor: string;
    };
    parameters: unknown;
    routes: Array<{
        startTime: string;
        endTime: string;
        executor: string;
        status?: unknown;
    }>;
}
export declare enum DOCQA_ANSWER_STATUS {
    UNKNOWN = 0,
    ANSWERED = 1,
    NOT_CONFIDENT = 2,
    NOT_ANSWERED = 3
}
export interface DocQAAnswer {
    STATUS: DOCQA_ANSWER_STATUS;
    matches: Document[];
    [k: string]: any;
}
export declare class UpstreamError extends Error {
    detail: any;
    constructor(msg: string, detail: any);
}
export declare class JinaDocBotRPC extends HTTPService {
    protected clientId: string;
    constructor(serverUri: string, clientId: string);
    askQuestion(text: string): Promise<Response & {
        data: JinaServerEnvelope<DocumentArray<Document>> & DocQAAnswer;
    } & {
        serial: number;
        config: import("./http-service").HTTPServiceRequestOptions;
    }>;
    sendFeedback(options: {
        requestId?: string;
        question?: string;
        answer?: string;
        answer_uri?: string;
        thumbup?: boolean | null;
    }): import("./http-service").PromiseWithCancel<Response & {
        data: any;
    } & {
        serial: number;
        config: import("./http-service").HTTPServiceRequestOptions;
    }>;
    getStatus(): import("./http-service").PromiseWithCancel<Response & {
        data: {
            jina: {
                [k: string]: any;
            };
            envs: {
                [k: string]: any;
            };
            usedMemory: string;
        };
    } & {
        serial: number;
        config: import("./http-service").HTTPServiceRequestOptions;
    }>;
    getProject(): import("./http-service").PromiseWithCancel<Response & {
        data: any;
    } & {
        serial: number;
        config: import("./http-service").HTTPServiceRequestOptions;
    }>;
}
