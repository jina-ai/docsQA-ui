import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { AnswerProcessingPlugin } from './plugins';
import { QAPair } from './shared';
export declare class JinaQABotController implements ReactiveController {
    protected host: ReactiveControllerHost;
    serverUri: string;
    active: boolean;
    ready: boolean;
    rpc: JinaDocBotRPC;
    qaPairs: QAPair[];
    channel: string;
    qaPairToFocus?: string;
    answerPlugins: AnswerProcessingPlugin[];
    protected storageEventListener?: (storageEvent: StorageEvent) => void;
    clientId: string;
    constructor(host: ReactiveControllerHost, serverUri: string, channel?: string);
    loadQaPairs(localData?: string): void;
    saveQaPairs(): void;
    protected __saveQaPairs(): void;
    hostConnected(): void;
    hostDisconnected(): void;
    setTargeted(requestId: string): void;
    dispatchEvent(eventName: string, detail?: object): void;
    askQuestion(text: string, etc?: object): Promise<QAPair>;
    sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none', overrideURI?: string, etc?: object): Promise<Response & {
        data: any;
    } & {
        serial: number;
        config: import("../lib/http-service").HTTPServiceRequestOptions;
    }>;
    sendBlockingFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none', overrideURI?: string): Promise<void>;
    clear(): void;
    getStatus(...keys: string[]): Promise<QAPair>;
    getProject(...keys: string[]): Promise<QAPair>;
}
