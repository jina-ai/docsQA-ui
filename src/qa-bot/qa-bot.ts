import { LitElement, html, PropertyValues } from 'lit';
import get from 'lodash-es/get';
import { property, query, state } from 'lit/decorators.js';
import { perNextTick } from '../lib/decorators/per-tick';
import { throttle } from '../lib/decorators/throttle';
import { customTextFragmentsPolyfill } from '../lib/text-fragments-polyfill';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController, QAPair } from './controller';
import { getLocalStorageKey, makeTextFragmentUriFromPassage } from './shared';
import type { Document as JinaDocument } from '../lib/jina-document-array'
import masterStyle from './style';
import {
    discussionIcon, downArrow, linkIcon, paperPlane,
    thumbDown, thumbUp,
    tripleDot, upArrow
} from './svg-icons';

const ABSPATHREGEXP = /^(https?:)?\/\/\S/;

/**
 * QABot custom element
 * @summary WebComponent for DocsQA
 * @slot - The intro headline and example questions user might define
 *
 * @attr label - Customize title text in the header part
 * @attr server - REQUIRED, specify the server url bot talks to.
 * @attr site - Specify site base location the links refer to, if not relative to current location.
 * @attr target - Specify <a target=""> of reference links.
 * @attr open - Set the chat-bot expanded or collapsed.
 * @attr theme - Choose between preset themes, auto, `light`, or `dark`.
 * @attr animate-by - Choose slide-up/slide-down animation between `height` or `position`
 */
export class QaBot extends LitElement {
    @property({ type: String, reflect: true })
    label = 'Ask our docs!';

    @property({ type: String })
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ attribute: 'link-to-text-fragment', type: String, reflect: true })
    linkToTextFragment?: 'none';

    @property({ type: String, reflect: true })
    target?: string = '_self';

    @property({ type: String })
    channel?: string;

    @property({ type: String, reflect: true })
    theme?: 'auto' | 'dark' | 'light' | string = 'auto';

    @property({ attribute: 'animate-by', type: String, reflect: true })
    animateBy?: 'position' | 'height' = 'height';

    @property({ attribute: 'powered-by-icon-src', type: String, reflect: true })
    poweredByIconSrc?: string;

    // @property({ type: Boolean })
    // manual?: boolean;

    @property({ type: Boolean, reflect: true })
    open?: boolean;

    @state()
    get busy() {
        return !(this.qaControl?.ready);
    }

    protected qaControl?: JinaQABotController;

    @query('.qabot__control textarea')
    protected textarea?: HTMLTextAreaElement;

    debugEnabled?: boolean = false;

    private __debugEventListener?: (evt: CustomEvent)=> void;

    constructor() {
        super();

        try {
            this.debugEnabled = Boolean(
                JSON.parse(localStorage.getItem(getLocalStorageKey(this.channel, 'debug')) || '')
            );
        } catch (err) {
            this.debugEnabled = false;
        }

        if (this.debugEnabled) {
            this.setupDebugEventListener();
        }

        customTextFragmentsPolyfill();
        if (document.readyState !== 'complete') {
            document.addEventListener('DOMContentLoaded', () => {
                this.requestUpdate();
            }, { once: true });
        }
    }

    static override styles = [
        resetCSS,
        customScrollbarCSS,
        masterStyle
    ];

    override update(changedProps: PropertyValues) {
        if (changedProps.has('server') && this.server) {
            this.qaControl = new JinaQABotController(this, this.server, this.channel);

            if (this.qaControl.qaPairs.length) {
                this.scrollDialogToBottom();
            }
        }
        super.update(changedProps);
    }

    override updated() {
        if (!this.qaControl) {
            return;
        }

        if (this.qaControl.qaPairToFocus) {
            this.scrollToAnswerByRequestId(this.qaControl.qaPairToFocus);
            this.open = true;
            this.qaControl.qaPairToFocus = undefined;
        }
    }

    protected onTextAreaInput(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }

        if (event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();

        this.submitQuestion();
    }

    setQaPairTargeted(qaPair?: QAPair) {
        if (!qaPair?.requestId) {
            return;
        }
        this.qaControl?.setTargeted(qaPair.requestId);
    }

    protected setupDebugEventListener(flag: boolean = true) {
        if (!this.__debugEventListener) {
            this.__debugEventListener = (event: CustomEvent)=> {
                const detail = event.detail;

                if (detail.type === 'question-answered') {

                    const dispObjs = (detail.document as JinaDocument)?.matches?.map((x: JinaDocument) => {
                        const dispObj = {
                            answer: x.text,
                            confidence: get(x, 'scores.confidence.value') as number,
                            paragraph: get(x, 'tags.paragraph') as string,
                            uri: get(x, 'uri') as string,
                            url: '',
                        };
                        dispObj.confidence *= 100;
                        dispObj.url = new URL(
                            this.makeReferenceLink({
                                answer: {
                                    text: dispObj.answer,
                                    uri: dispObj.uri,
                                    textFragmentUri: makeTextFragmentUriFromPassage(
                                        dispObj.answer, dispObj.paragraph, dispObj.uri
                                    )
                                }
                            } as any), window.location.href
                        ).toString();

                        return dispObj;
                    });
                    // eslint-disable-next-line no-console
                    console.log(`\n%cThe question: %c${detail.question}`, 'color: gray', 'color: #EB6161');
                    for (const x of dispObjs.reverse()) {

                        const [before, after, ...etc] = x.paragraph.split(x.answer);

                        const contentVec = [];
                        if (etc.length) {
                            contentVec.push(before, x.answer, etc.join(x.answer));
                        } else if (after) {
                            contentVec.push(before, x.answer, after);
                        } else if (!before) {
                            contentVec.push('', x.answer, '');
                        } else {
                            contentVec.push(before, x.answer, '');
                        }

                        // eslint-disable-next-line prefer-const
                        let [a, b, c] = contentVec;
                        if (a) {
                            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                            const cappedA = a.replace(/[\r\n]/gi, '').slice(-60);
                            const words = cappedA.split(' ');
                            const firstLetter = words[0]?.[0];
                            if (firstLetter.toUpperCase() !== firstLetter) {
                                words.shift();
                            }
                            a = words.join(' ');
                        }
                        if (c) {
                            const cappedC = c.replace(/[\r\n]/gi, '').slice(0, 60);
                            const words = cappedC.split(' ');
                            words.pop();
                            c = words.join(' ');
                        }

                        // eslint-disable-next-line no-console
                        console.log(
                            `%c${x.confidence.toFixed(2)}\t%c... ${a}%c${b}%c${c} ...\n\t\t%c${x.url}`,
                            'color: #EB6161', 'color: gray', 'color: #009191', 'color: gray', 'color: blue'
                        );
                    }
                }

            };
        }

        if (!flag) {
            this.removeEventListener('debug', this.__debugEventListener as any);

            return;
        }

        this.addEventListener('debug', this.__debugEventListener as any);
    }

    debugCommands(input: string) {
        const [cmd, ...args] = input.split(' ');
        switch (cmd) {
            case 'clear': {
                this.qaControl?.clear();
                break;
            }

            case 'debug': {
                if (args.length) {
                    // clear debug;
                    delete (window as any).qabotDebug;
                    this.debugEnabled = false;
                    localStorage.removeItem(getLocalStorageKey(this.channel, 'debug'));

                    this.setupDebugEventListener(false);

                    // eslint-disable-next-line no-console
                    console.info(`Debug disabled for qabot: ${this.channel || 'default'}`);

                    break;
                }

                const qabotDebug = {
                    this: this,
                    customTextFragmentsPolyfill,
                };
                (window as any).qabotDebug = qabotDebug;
                this.debugEnabled = true;
                localStorage.setItem(getLocalStorageKey(this.channel, 'debug'), JSON.stringify(this.debugEnabled));

                this.setupDebugEventListener();
                // eslint-disable-next-line no-console
                console.info(`Debug enabled for qabot: ${this.channel || 'default'}`);

                break;
            }

            case 'highlight': {
                if (!args.length) {
                    break;
                }
                if (location.hash.includes(':~:')) {
                    location.hash = location.hash.replace(/:~:text=.*$/, `:~:text=${args.join(' ')}`);
                    break;
                }
                location.hash += `:~:text=${args.join(' ')}`;
                break;
            }

            case 'close': {
                this.open = false;

                break;
            }

            default: {
                break;
            }
        }

        this.textarea!.value = '';
    }

    @throttle()
    async submitQuestion() {
        if (!this.qaControl) {
            return;
        }
        const questionInput = this.textarea?.value;
        if (!questionInput) {
            return;
        }

        if (questionInput.startsWith(':')) {
            this.debugCommands(questionInput.slice(1));

            return;
        }

        const rPromise = this.qaControl.askQuestion(questionInput);

        this.scrollDialogToBottom();

        try {
            const qaPair = await rPromise;
            this.qaControl.sendFeedback(
                qaPair,
                'none',
                new URL(this.makeReferenceLink(qaPair), window.location.href).toString()
            ).catch(()=> 'swallow');
            this.textarea!.value = '';

        } finally {
            await this.scrollDialogToBottom();
        }

        await this.updateComplete;
        if (this.open) {
            this.textarea?.focus();
        }
    }

    @throttle()
    protected async submitFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none' = 'none') {
        if (!this.qaControl) {
            return;
        }

        const r = await this.qaControl?.sendBlockingFeedback(
            qaPair,
            feedback,
            new URL(this.makeReferenceLink(qaPair), window.location.href).toString()
        );

        await this.scrollDialogToBottom();

        return r;
    }

    @perNextTick()
    @throttle()
    async scrollDialogToBottom() {
        await this.updateComplete;
        const elem = this.renderRoot?.querySelector('.qabot__answer-block');

        if (!elem) {
            return;
        }

        elem.scroll({
            top: elem.scrollHeight,
            left: 0,
            behavior: this.open ? 'smooth' : 'auto'
        });
    }

    @perNextTick()
    @throttle()
    async scrollToAnswerByRequestId(requestId: string) {
        if (!this.qaControl) {
            return;
        }

        await this.updateComplete;

        let targetIdx = -1;

        for (const [index, qaPair] of this.qaControl.qaPairs.entries()) {
            if (!qaPair.requestId) {
                continue;
            }
            if (qaPair.requestId === requestId) {
                targetIdx = index;
                break;
            }
        }

        if (targetIdx === -1) {
            return this.scrollDialogToBottom();
        }

        const elem = this.renderRoot?.querySelector(`.answer-dialog > .qa-pair:nth-child(${targetIdx + 1})`);

        if (!elem) {
            return this.scrollDialogToBottom();
        }

        elem.scrollIntoView({
            block: 'start',
            behavior: this.open ? 'smooth' : 'auto'
        });
    }

    toggleOpen() {
        this.open = !this.open;
        if (this.open) {
            this.textarea?.focus();
        }
    }

    protected makeReferenceLink(qa: QAPair) {
        if (!qa?.answer) {
            return '#';
        }
        let uri: string | undefined;
        if (this.linkToTextFragment === 'none') {
            uri = qa.answer.uri;
        } else {
            uri = qa.answer.textFragmentUri;
        }

        if (!uri) {
            return '#';
        }

        if (ABSPATHREGEXP.test(uri)) {
            return uri;
        }

        if (this.site) {
            const fixedLink = `/${uri}`.replace(/^\/+/, '/');
            if (ABSPATHREGEXP.test(this.site)) {
                return `${this.site}${fixedLink}`;
            }

            if (this.site.startsWith('/')) {
                return `${this.site}${uri}`.replace(/^\/+/, '/');
            }

            return `//${this.site}${fixedLink}`;
        }

        return uri;
    }

    protected getSingleQAComp(qa: QAPair) {
        return html`
            <div class="qa-pair">
                ${qa.question ? html`
                    <div class="qa-row question">
                        <div class="bubble">
                            <div class="talktext">
                                <p>${qa.question}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div class="qa-row answer">
                    <div class="bubble">
                        <div class="talktext">
                            ${
                                qa.answer ?
                                    html`<p>${qa.answer.text}</p>` :
                                    qa.error ? '' : html`<i class="icon loading triple-dot">${tripleDot}</i>`
                            }
                            ${qa.error ? html`
                                <p>${qa.error.toString()}</p>
                            ` : ''}
                        </div>


                        <div class="feedback-tooltip">
                            ${qa.error ? html`
                                <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
                            ` : ''}
                            ${qa.answer?.uri ? html`
                                <a class="answer-reference" @click="${()=> this.setQaPairTargeted(qa)}" href="${this.makeReferenceLink(qa)}" target="${this.target as any}">Source<i class="icon link">${linkIcon}</i></a>
                            ` : ''}
                            ${(qa.question && qa.answer) ? html`
                                <div class="thumbs">
                                    <button class="thumb thumbup" ?active="${qa.feedback === true}" @click="${()=> this.submitFeedback(qa, 'up')}">
                                        <i class="icon icon-thumb-up">${thumbUp}</i>
                                    </button>
                                    <button class="thumb thumbdown" ?active="${qa.feedback === false}" @click="${()=> this.submitFeedback(qa, 'down')}">
                                        <i class="icon icon-thumb-down">${thumbDown}</i>
                                    </button>
                                </div>
                            ` : ''}

                        </div>
                    </div>
                </div>
            </div>
    `;
    }

    protected getAnswerBlock() {
        if (!(this.qaControl?.qaPairs.length)) {
            return html`
            <div class="answer-hint" tabindex="0">
                <slot>
                    <dl>
                        <dt>You can ask questions about Jina. Try:</dt>
                        <dd>What is Jina?</dd>
                        <dd>Does Jina support Kubernetes?</dd>
                        <dd>How can I traverse a nested DocumentArray?</dd>
                        <dd>What are the basic concepts in Jina?</dd>
                    </dl>
                </slot>
            </div>
        `;
        }

        return html`
            <div class="answer-dialog">
                ${this.qaControl?.qaPairs.map((qa) => this.getSingleQAComp(qa))}
            </div>
        `;
    }

    override render() {

        return html`
        <div class="qabot card" ?busy="${this.busy}" >
            <button class="card__header" @click="${this.toggleOpen}">
                <span class="card__title">
                    <i class="icon">${discussionIcon}</i>
                    <span class="text">${this.label}</span>
                </span>
                <i class="icon arrow-down">${downArrow}</i>
                <i class="icon arrow-up">${upArrow}</i>
            </button>
            <div class="card__content">
                <div class="qabot__answer-block">
                    ${this.getAnswerBlock()}
                </div>
                <div class="qabot__control">
                    <textarea maxlength="100" rows="3"
                        tabindex="0"
                        ?disabled="${this.busy}"
                        @keypress="${this.onTextAreaInput}"
                        placeholder="${this.server ? 'Type your question here...' : 'Waiting for server configuration...'}"></textarea>
                    <button title="Submit" ?disabled="${this.busy}" @click="${this.submitQuestion}">
                        <i class="icon icon-plane">${paperPlane}</i>
                    </button>
                    ${this.poweredByIconSrc ? html`<div class="powered-by"><i class="icon"><img src="${this.poweredByIconSrc}" alt="powered-by"></i></div>` : ''}
                </div>
            </div>
        </div>
    `;
    }
}
