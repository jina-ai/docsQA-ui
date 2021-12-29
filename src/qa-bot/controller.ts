import { ReactiveController, ReactiveControllerHost } from 'lit';
import { perNextTick } from '../lib/decorators/per-tick';
import { serialOperation } from '../lib/decorators/serial-op';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';


export interface QAPair {
    question?: string;
    answer?: Partial<JinaDocument>;
    error?: Error | string;
    feedback?: boolean | null;
    requestId?: string;
}

export function getChannel(channel: string = 'default'): string {
    return `qabot:channel:${channel}`;
}

export class JinaQABotController implements ReactiveController {

    active: boolean = false;

    ready: boolean = true;

    rpc: JinaDocBotRPC;

    qaPairs: QAPair[];
    channel: string;

    constructor(
        protected host: ReactiveControllerHost,
        public serverUri: string,
        channel?: string
    ) {
        this.qaPairs = [];
        this.rpc = new JinaDocBotRPC(serverUri);
        this.channel = getChannel(channel);
        window.addEventListener('storage', (storageEvent: StorageEvent) => {
            if (storageEvent.key !== this.channel) {
                return;
            }

            if (storageEvent.newValue === null) {
                return;
            }

            try {
                const qaPair = JSON.parse(storageEvent.newValue!);
                this.qaPairs.push(qaPair);
            } catch (err) {
                return;
            }

            return;
        });

        host.addController(this);
    }

    @perNextTick()
    saveQaPairs() {
        localStorage.setItem(this.channel, JSON.stringify(this.qaPairs.filter((pair) => pair.requestId)));
    }

    hostConnected() {
        this.active = true;
    }

    hostDisconnected() {
        this.active = false;
    }

    @serialOperation()
    async askQuestion(text: string) {
        const qaPair: QAPair = {
            question: text,
            answer: undefined
        };
        this.qaPairs.push(qaPair);

        try {
            this.ready = false;
            this.host.requestUpdate();
            const r = await this.rpc.askQuestion(text);
            qaPair.answer = r.data.answer;
            qaPair.requestId = r.data.requestId;

            this.saveQaPairs();

            return qaPair;
        } catch (e: any) {
            qaPair.error = e;

            throw e;
        } finally {
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    async sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none') {
        const thumbUpMap = {
            up: true,
            down: false,
            none: null
        };
        const thumbUpVal = thumbUpMap[feedback];

        try {
            const r = await this.rpc.sendFeedback({
                question: qaPair.question,
                answer: qaPair.answer?.text,
                answer_uri: qaPair.answer?.uri,
                thumbup: thumbUpVal
            });

            if (feedback !== 'none') {
                this.qaPairs.push({
                    answer: {
                        text: 'Thanks for your feedback! We will improve 🙇‍♂️',
                        uri: ''
                    }
                });
                this.saveQaPairs();
            }

            return r;
        } catch (e: any) {

            throw e;
        } finally {
            qaPair.feedback = thumbUpVal;
            this.host.requestUpdate();
        }
    }

    @serialOperation()
    async sendBlockingFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none') {
        this.ready = false;
        try {
            this.host.requestUpdate();
            await this.sendFeedback(qaPair, feedback);
        } finally {
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    clear() {
        this.qaPairs.length = 0;
        this.ready = true;
        this.host.requestUpdate();
        this.saveQaPairs();
    }

}
