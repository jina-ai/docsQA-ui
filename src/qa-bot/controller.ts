import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';


export interface QAPair {
    question: string;
    answer?: {
        text: string;
        uri: string;
    }
}

export class JinaQABotController implements ReactiveController {

    active: boolean = false;

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

}
