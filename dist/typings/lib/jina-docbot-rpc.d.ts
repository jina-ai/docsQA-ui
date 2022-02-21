import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';
export interface JinaServerEnvelope<T = any> {
    data: {
        docs: T;
        groundtruths: unknown[];
    };
    requestId: string;
}
export declare enum DOCQA_ANSWER_STATUS {
    UNKNOWN = -1,
    ANSWERED = 0,
    NOT_CONFIDENT = 1,
    NOT_ANSWERED = 2
}
export interface DocQAAnswer {
    STATUS: DOCQA_ANSWER_STATUS;
    matches: Document[];
    [k: string]: any;
}
export declare class JinaDocBotRPC extends HTTPService {
    constructor(serverUri: string);
    askQuestion(text: string): Promise<Response & {
        data: JinaServerEnvelope<DocumentArray<Document>> & DocQAAnswer;
    } & {
        serial: number;
        config: import("./http-service").HTTPServiceRequestOptions;
    }>;
    sendFeedback(options: {
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
