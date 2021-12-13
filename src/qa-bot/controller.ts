import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';


export interface QAPair {
    question: string;
    answer?: Partial<JinaDocument>;
    error?: Error | string;
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

            return r;
        } catch (e: any) {
            qaPair.error = e;

            throw e;
        } finally {
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    clear() {
        this.qaPairs.length = 0;
    }

}
