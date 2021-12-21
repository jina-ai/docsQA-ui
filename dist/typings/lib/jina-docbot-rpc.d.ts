import { HTTPService } from './http-service';
import { Document } from './jina-document-array';
export declare class JinaDocBotRPC extends HTTPService {
    constructor(serverUri: string);
    askQuestion(text: string): Promise<Document>;
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
