import { ReactiveController, ReactiveControllerHost } from 'lit';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';


export class JinaQABotController implements ReactiveController {

    active: boolean = false;

    rpc: JinaDocBotRPC;

    constructor(
        protected host: ReactiveControllerHost,
        public serverUri: string
    ) {

        host.addController(this);
        this.rpc = new JinaDocBotRPC(serverUri);
    }

    hostConnected() {
        this.active = true;
    }

    hostDisconnected() {
        this.active = false;
    }

}
