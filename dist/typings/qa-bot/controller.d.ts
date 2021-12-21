import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';
export interface QAPair {
    question?: string;
    answer?: Partial<JinaDocument>;
    error?: Error | string;
    feedback?: boolean | null;
}
export declare class JinaQABotController implements ReactiveController {
    protected host: ReactiveControllerHost;
    serverUri: string;
    active: boolean;
    ready: boolean;
    rpc: JinaDocBotRPC;
    qaPairs: QAPair[];
    constructor(host: ReactiveControllerHost, serverUri: string);
    hostConnected(): void;
    hostDisconnected(): void;
    askQuestion(text: string): Promise<QAPair>;
    sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none'): Promise<Response & {
        data: any;
    } & {
        serial: number;
        config: import("../lib/http-service").HTTPServiceRequestOptions;
    }>;
    clear(): void;
}
