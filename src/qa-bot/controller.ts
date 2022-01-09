import { ReactiveController, ReactiveControllerHost } from 'lit';
import { perNextTick } from '../lib/decorators/per-tick';
import { serialOperation } from '../lib/decorators/serial-op';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';

export interface QAPair {
    question?: string;
    answer?: Partial<JinaDocument> & { textFragmentUri?: string; };
    error?: Error | string;
    feedback?: boolean | null;
    requestId?: string;
    ts: number;
    TARGETED?: boolean;
}

export function getChannel(channel: string = 'default'): string {
    return `qabot:channel:${channel}`;
}

function patchTextFragmentEncoding(text: string) {
    return encodeURIComponent(text).replace(/-/g, '%2D');
}

export class JinaQABotController implements ReactiveController {

    active: boolean = false;

    ready: boolean = true;

    rpc: JinaDocBotRPC;

    qaPairs: QAPair[];
    channel: string;

    qaPairToFocus?: string;

    protected storageEventListener?: (storageEvent: StorageEvent) => void;

    constructor(
        protected host: ReactiveControllerHost,
        public serverUri: string,
        channel?: string,
    ) {
        this.qaPairs = [];
        this.rpc = new JinaDocBotRPC(serverUri);
        this.channel = getChannel(channel);

        host.addController(this);
    }

    loadQaPairs(localData?: string) {
        const data = localData || localStorage.getItem(this.channel);
        if (!data) {
            return;
        }
        try {
            const foreignPairs = JSON.parse(data);

            if (!Array.isArray(foreignPairs) || !foreignPairs.length) {
                return;
            }

            if (foreignPairs[foreignPairs.length - 1].ts + 1000 * 60 * 60 * 24 < Date.now()) {
                return;
            }

            const curIdx = new Set();
            for (const qaPair of this.qaPairs) {
                curIdx.add(qaPair.requestId);
            }

            for (const foreignPair of foreignPairs) {

                if (curIdx.has(foreignPair.requestId)) {
                    continue;
                }

                this.qaPairs.push(foreignPair);
                curIdx.add(foreignPair.requestId);
            }

            this.qaPairs.sort((a, b) => a.ts - b.ts);

            if (!this.active) {
                const parsedUrl = new URL(window.location.href);
                const hash = parsedUrl.hash.slice(1).replace(/:~:.*$/, '');
                const pathname = parsedUrl.pathname;
                for (const x of this.qaPairs) {
                    if (!x.requestId) {
                        continue;
                    }
                    if (!x.TARGETED) {
                        continue;
                    }

                    const parsedUri = new URL(x.answer?.uri || '/', window.location.href);
                    if (parsedUri.pathname !== pathname) {
                        continue;
                    }
                    if (hash && !parsedUri.hash.includes(hash)) {
                        continue;
                    }

                    this.qaPairToFocus = x.requestId;
                    delete x.TARGETED;
                    this.saveQaPairs();

                    break;
                }
            }

        } catch (err) {
            return;
        }
    }

    @perNextTick()
    saveQaPairs() {
        this.__saveQaPairs();
    }
    protected __saveQaPairs() {
        localStorage.setItem(this.channel, JSON.stringify(this.qaPairs.filter((pair) => pair.requestId)));
    }

    hostConnected() {

        this.storageEventListener = (storageEvent: StorageEvent) => {
            if (storageEvent.key !== this.channel) {
                return;
            }

            if (storageEvent.newValue === null) {
                return;
            }

            const beforeLoadQaCount = this.qaPairs.length;
            this.loadQaPairs(storageEvent.newValue);

            if (this.qaPairs.length !== beforeLoadQaCount) {
                this.host.requestUpdate();
            }

            return;
        };

        window.addEventListener('storage', this.storageEventListener);

        this.loadQaPairs();

        if (this.qaPairs.length) {
            this.host.requestUpdate();
        }

        this.active = true;
    }

    hostDisconnected() {

        if (this.storageEventListener) {
            window.removeEventListener('storage', this.storageEventListener);
        }

        this.active = false;
    }

    setTargeted(requestId: string) {
        const targetPair = this.qaPairs.find((x) => x.requestId === requestId);
        if (!targetPair) {
            return;
        }
        targetPair['TARGETED'] = true;
        this.__saveQaPairs();
    }

    @serialOperation()
    async askQuestion(text: string) {
        const qaPair: QAPair = {
            question: text,
            answer: undefined,
            ts: Date.now()
        };
        this.qaPairs.push(qaPair);

        try {
            this.ready = false;
            this.host.requestUpdate();
            const r = await this.rpc.askQuestion(text);
            const answer = r.data.answer;

            const paragraph = answer?.tags?.paragraph;

            if (paragraph && answer.uri) {
                const parsedUri = new URL(answer.uri, window.location.href);
                if (!parsedUri.hash) {
                    answer.textFragmentUri = `${answer.uri}${answer.uri.endsWith('#') ? '' : '#'}${this.makeTextFragmentFromPassage(paragraph, answer.text)}`;
                } else {
                    const newHash = this.makeTextFragmentFromPassage(paragraph, answer.text);
                    answer.textFragmentUri = `${answer.uri}${newHash}`;
                }
            }

            qaPair.answer = answer;

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

    makeTextFragmentFromPassage(passage: string, fragment: string) {
        const [prefix, suffix] = passage.split(fragment);

        const prefixFragment = prefix.match(/\b\w.{0,15}$/)?.[0].trim();
        const suffixFragment = (suffix || '').trim().match(/^\S.{0,14}\b/)?.[0].trim();

        return `:~:text=${prefixFragment ? `${patchTextFragmentEncoding(prefixFragment)}-,` : ''}${patchTextFragmentEncoding(fragment)}${suffixFragment ? `,-${patchTextFragmentEncoding(suffixFragment)}` : ''}`;
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
                        uri: '',
                    },
                    ts: Date.now()
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
