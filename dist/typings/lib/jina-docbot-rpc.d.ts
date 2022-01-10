import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';
export interface JinaServerEnvelope<T = any> {
    data: {
        docs: T;
    };
    requestId: string;
}
export declare class JinaDocBotRPC extends HTTPService {
    constructor(serverUri: string);
    askQuestion(text: string): Promise<Response & {
        data: JinaServerEnvelope<DocumentArray<Document>> & {
            [k: string]: any;
        };
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
}
