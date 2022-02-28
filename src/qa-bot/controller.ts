import { ReactiveController, ReactiveControllerHost } from 'lit';
import get from 'lodash-es/get';
import { perNextTick } from '../lib/decorators/per-tick';
import { serialOperation } from '../lib/decorators/serial-op';
import { JinaDocBotRPC } from '../lib/jina-docbot-rpc';
import { generateUUID } from '../lib/uuid';
import { AnswerProcessingPlugin, ANSWER_PROCESSING_PLUGINS } from './plugins';
import { ANSWER_RENDER_TEMPLATE, getLocalStorageKey, QAPair } from './shared';

export class JinaQABotController implements ReactiveController {

    active: boolean = false;

    ready: boolean = true;

    rpc: JinaDocBotRPC;

    qaPairs: QAPair[];
    channel: string;

    qaPairToFocus?: string;

    answerPlugins: AnswerProcessingPlugin[] = [...ANSWER_PROCESSING_PLUGINS];

    protected storageEventListener?: (storageEvent: StorageEvent) => void;

    clientId: string;

    constructor(
        protected host: ReactiveControllerHost,
        public serverUri: string,
        channel?: string,
    ) {
        this.qaPairs = [];
        this.channel = getLocalStorageKey(channel);
        const clientIdStorageKey = getLocalStorageKey(undefined, 'clientId');
        this.clientId = localStorage.getItem(clientIdStorageKey) || generateUUID();
        localStorage.setItem(clientIdStorageKey, this.clientId);
        this.rpc = new JinaDocBotRPC(serverUri, this.clientId);

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

            if (foreignPairs[0].ts + 1000 * 60 * 60 * 24 < Date.now()) {
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
        // eslint-disable-next-line dot-notation
        targetPair['TARGETED'] = true;
        this.__saveQaPairs();
    }

    dispatchEvent(eventName: string, detail?: object) {
        const host = this.host as ReactiveControllerHost & EventTarget;
        if (!host?.dispatchEvent) {
            return;
        }
        host.dispatchEvent(new CustomEvent(eventName, {
            detail,
        }));
    }

    @serialOperation()
    async askQuestion(text: string) {
        const qaPair: QAPair = {
            question: text,
            answer: undefined,
            ts: Date.now()
        };
        this.qaPairs.push(qaPair);

        // To improve the quality of DPR results, always have `?` at the end of query text https://github.com/jina-ai/docsQA-ui/issues/14
        const mangledText = text.trim().concat('?').replace(/\?+$/, '?');

        try {
            this.ready = false;
            this.host.requestUpdate();
            const r = await this.rpc.askQuestion(mangledText);

            const result = r.data;

            qaPair.requestId = result.requestId;
            qaPair.STATUS = result.STATUS;

            for (const plugin of this.answerPlugins) {
                plugin.call(result, qaPair);
            }

            this.dispatchEvent('debug', {
                type: 'question-answered',
                question: mangledText,
                qaPair,
                clientId: this.clientId,
                document: get(result, 'matches[0]'),
            });

            this.saveQaPairs();

            return qaPair;
        } catch (e: any) {
            qaPair.error = e;
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.ERROR;
            this.dispatchEvent('debug', {
                type: 'error',
                clientId: this.clientId,
                err: e
            });
            throw e;
        } finally {
            this.ready = true;
            this.host.requestUpdate();
        }
    }

    async sendFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none', overrideURI?: string) {
        const thumbUpMap = {
            up: true,
            down: false,
            none: undefined
        };
        const thumbUpVal = thumbUpMap[feedback];

        try {

            let answerText = qaPair.answer?.text;
            if (qaPair.answer?.tags?.answerVec) {
                const [a, b, c] = qaPair.answer.tags.answerVec;
                answerText = `${a}**${b}**${c}`;
            }

            const r = await this.rpc.sendFeedback({
                question: qaPair.question,
                answer: answerText,
                answer_uri: overrideURI || qaPair.answer?.uri,
                thumbup: thumbUpVal
            });

            switch (feedback) {
                case 'up': {
                    this.qaPairs.push({
                        answer: {
                            textKey: 'feedbackThumbUp',
                        },
                        useTemplate: ANSWER_RENDER_TEMPLATE.PREFERENCE_TEXT,
                        ts: Date.now()
                    });
                    this.saveQaPairs();
                    break;
                }
                case 'down': {
                    this.qaPairs.push({
                        answer: {
                            textKey: 'feedbackThumbDown',
                        },
                        useTemplate: ANSWER_RENDER_TEMPLATE.PREFERENCE_TEXT,
                        ts: Date.now()
                    });
                    this.saveQaPairs();
                    break;
                }
                default: {
                    break;
                }
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
    async sendBlockingFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none', overrideURI?: string) {
        this.ready = false;
        try {
            this.host.requestUpdate();
            await this.sendFeedback(qaPair, feedback, overrideURI);
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

    async getStatus(...keys: string[]) {
        const qaPair: QAPair = {
            ts: Date.now(),
        };

        this.qaPairs.push(qaPair);
        await this.host.requestUpdate();
        try {
            const r = await this.rpc.getStatus();
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK;

            const infoPairs = [];

            if (r.data.jina) {
                for (const [k, v] of Object.entries(r.data.jina)) {
                    infoPairs.push([k, v]);
                }
            }

            if (r.data.usedMemory) {
                infoPairs.push(['usedMemory', r.data.usedMemory]);
            }

            qaPair.answer = {
                text: (keys.length ? infoPairs.filter(([k]) => keys.includes(k)) : infoPairs).map(([k, v]) => `${k}: ${v}`).join('\n'),
                uri: `${this.serverUri}/status`,
            };

        } catch (err: any) {
            qaPair.error = err;
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.ERROR;
        } finally {
            await this.host.requestUpdate();
        }

        return qaPair;
    }

    async getProject(...keys: string[]) {
        const qaPair: QAPair = {
            ts: Date.now(),
        };

        this.qaPairs.push(qaPair);
        await this.host.requestUpdate();
        try {
            const r = await this.rpc.getProject();
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK;

            const infoPairs: [string, any][] = [];
            const data = r.data?.[0];
            if (data) {
                for (const [k, v] of Object.entries(data)) {
                    if (k === 'metadata') {
                        for (const [mk, mv] of Object.entries(v as any)) {
                            if (typeof mv === 'object') {
                                continue;
                            }
                            infoPairs.push([`${mk}`, mv]);
                        }
                        continue;
                    }
                    infoPairs.push([k, v]);
                }
            }

            qaPair.answer = {
                text: (keys.length ? infoPairs.filter(([k]) => keys.includes(k)) : infoPairs).map(([k, v]) => `${k}: ${v}`).join('\n'),
                uri: `https://apidocsqa.jina.ai/projects?metadata=true&host=${this.rpc.baseURL.origin}`,
            };

        } catch (err: any) {
            qaPair.error = err;
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.ERROR;
        } finally {
            await this.host.requestUpdate();
        }

        return qaPair;
    }

}
