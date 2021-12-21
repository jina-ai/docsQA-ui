import { ReactiveController, ReactiveControllerHost } from 'lit';
import { serialOperation } from '../lib/decorators/serial-op';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';


export interface QAPair {
    question?: string;
    answer?: Partial<JinaDocument>;
    error?: Error | string;
    feedback?: boolean | null;
}

export class JinaQABotController implements ReactiveController {

    active: boolean = false;

    ready: boolean = true;

    rpc: JinaDocBotRPC;

    qaPairs: QAPair[];

    constructor(
        protected host: ReactiveControllerHost,
        public serverUri: string
    ) {
        this.qaPairs = [];
        this.rpc = new JinaDocBotRPC(serverUri);
        host.addController(this);
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
            qaPair.answer = r;

            return qaPair;
        } catch (e: any) {
            qaPair.error = e;

            throw e;
        } finally {
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    @serialOperation()
    async sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none') {

        const thumbUpMap = {
            up: true,
            down: false,
            none: null
        };
        const thumbUpVal = thumbUpMap[feedback];

        try {
            this.ready = false;
            this.host.requestUpdate();

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
            }

            return r;
        } catch (e: any) {

            throw e;
        } finally {
            qaPair.feedback = thumbUpVal;
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    clear() {
        this.qaPairs.length = 0;
        this.host.requestUpdate();
    }

}
