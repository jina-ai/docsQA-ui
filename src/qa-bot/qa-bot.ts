import { LitElement, html, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { perNextTick } from '../lib/decorators/per-tick';
import { throttle } from '../lib/decorators/throttle';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController, QAPair } from './controller';
import masterStyle from './style';
import {
    discussionIcon, downArrow, linkIcon, paperPlane,
    poweredByJina, thumbDown, thumbUp,
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
    linkToTextFragment?: 'auto' | 'none' = 'auto';

    @property({ type: String, reflect: true })
    target?: string = '_self';

    @property({ type: String })
    channel?: string;

    @property({ type: String, reflect: true })
    theme?: 'auto' | 'dark' | 'light' | string = 'auto';

    @property({ attribute: 'animate-by', type: String, reflect: true })
    animateBy?: 'position' | 'height' = 'height';

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

    constructor() {
        super();

        document.addEventListener('DOMContentLoaded', () => {
            this.requestUpdate();
        }, { once: true });
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

    @throttle()
    async submitQuestion() {
        if (!this.qaControl) {
            return;
        }
        const questionInput = this.textarea?.value;
        if (!questionInput) {
            return;
        }

        if (questionInput.startsWith(':clear')) {
            this.qaControl.clear();
            this.textarea!.value = '';

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
        } else if ('fragmentDirective' in Location.prototype || 'fragmentDirective' in document) {
            uri = qa.answer.textFragmentUri || qa.answer.uri;
        } else {
            uri = qa.answer.uri;
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
                    <div class="powered-by"><i class="icon icon-powered-by-jina">${poweredByJina}</i></div>
                </div>
            </div>
        </div>
    `;
    }
}
