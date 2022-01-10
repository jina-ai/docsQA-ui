import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';
export interface QAPair {
    question?: string;
    answer?: Partial<JinaDocument> & {
        textFragmentUri?: string;
    };
    error?: Error | string;
    feedback?: boolean | null;
    requestId?: string;
    ts: number;
    TARGETED?: boolean;
}
export declare function getChannel(channel?: string): string;
export declare class JinaQABotController implements ReactiveController {
    protected host: ReactiveControllerHost;
    serverUri: string;
    active: boolean;
    ready: boolean;
    rpc: JinaDocBotRPC;
    qaPairs: QAPair[];
    channel: string;
    qaPairToFocus?: string;
    protected storageEventListener?: (storageEvent: StorageEvent) => void;
    constructor(host: ReactiveControllerHost, serverUri: string, channel?: string);
    loadQaPairs(localData?: string): void;
    saveQaPairs(): void;
    protected __saveQaPairs(): void;
    hostConnected(): void;
    hostDisconnected(): void;
    setTargeted(requestId: string): void;
    askQuestion(text: string): Promise<QAPair>;
    makeTextFragmentFromPassage(passage: string, fragment: string): string;
    sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none'): Promise<Response & {
        data: any;
    } & {
        serial: number;
        config: import("../lib/http-service").HTTPServiceRequestOptions;
    }>;
    sendBlockingFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none'): Promise<void>;
    clear(): void;
}
