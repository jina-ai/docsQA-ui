import { LitElement, html, css, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { throttle } from '../lib/decorators/throttle';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController, QAPair } from './controller';
import masterStyle from './style';
import { discussionIcon, downArrow, paperPlane, poweredByJina, thumbDown, thumbUp, tripleDot, upArrow } from './svg-icons';


/**
 * QABot custom element
 * @summary WebComponent for Jina-docs-bot
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
    @property({ type: String, reflect: true})
    label = 'Ask our docs!';

    @property({ type: String })
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ type: String, reflect: true })
    target?: string = '_self';

    @property({ type: String, reflect: true })
    theme?: 'auto' | 'dark' | 'light' | string = 'auto';

    @property({attribute: 'animate-by', type: String, reflect: true })
    animateBy?: 'position' | 'height' = 'height';

    // @property({ type: Boolean })
    // manual?: boolean;

    @property({ type: Boolean, reflect: true })
    open?: boolean;

    protected qaControl?: JinaQABotController;

    @query('.jina-qabot__control textarea')
    protected textarea?: HTMLTextAreaElement;

    constructor() {
        super();

    }

    static override styles = [
        resetCSS,
        customScrollbarCSS,
        masterStyle
    ];

    override update(changedProps: PropertyValues) {
        if (changedProps.has('server') && this.server) {
            this.qaControl = new JinaQABotController(this, this.server);
        }
        super.update(changedProps);
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

        setTimeout(() => {
            this.scrollDialogToBottom();
        }, 0);

        try {
            const qaPair = await rPromise;
            this.qaControl.sendFeedback(qaPair, 'none').catch(()=> 'swallow');
            this.textarea!.value = '';

        } finally {
            await this.scrollDialogToBottom();
        }

        setTimeout(()=> {
            if (this.open) {
                this.textarea?.focus();
            }
        }, 100);
    }

    @throttle()
    protected async submitFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none' = 'none') {
        if (!this.qaControl) {
            return;
        }

        const r = await this.qaControl?.sendFeedback(qaPair, feedback);

        await this.scrollDialogToBottom();

        return r;
    }

    @throttle()
    async scrollDialogToBottom() {
        await this.updateComplete;
        const elem = this.renderRoot?.querySelector('.jina-qabot__answer-block');
        elem?.scroll({
            top: elem.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    toggleOpen() {
        this.open = !this.open;
        if (this.open) {
            this.textarea?.focus();
        }
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
                                    qa.error ? '' : html`<div class="loading triple-dot">${tripleDot}</div>`
                            }
                            ${qa.error ? html`
                                <p>${qa.error.toString()}</p>
                            `:'' }
                        </div>


                        <div class="feedback-tooltip">
                            ${qa.error ? html`
                                <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
                            ` : ''}
                            ${qa.answer?.uri ? html`
                                <a class="answer-reference" href="${(this.site || '') + qa.answer.uri}" target="${this.target as any}">Source</a>
                            `:''}
                            ${(qa.question && qa.answer) ? html`
                                <div class="thumbs">
                                    <div class="thumb thumbup" ?active="${qa.feedback === true}" @click="${()=> this.submitFeedback(qa, 'up')}">
                                        <i class="icon icon-thumb-up">${thumbUp}</i>
                                    </div>
                                    <div class="thumb thumbdown" ?active="${qa.feedback === false}" @click="${()=> this.submitFeedback(qa, 'down')}">
                                        <i class="icon icon-thumb-down">${thumbDown}</i>
                                    </div>
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
            <div class="answer-hint">
                <slot>
                    <h3>You can ask questions about Jina. Try:</h3>
                    <p>What is Jina?</p>
                    <p>Does Jina support Kubernetes?</p>
                    <p>How can I traverse a nested DocumentArray?</p>
                    <p>What are the basic concepts in Jina?</p>
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
        <div class="jina-qabot card" ?busy="${!(this.qaControl?.ready)}" >
            <div class="card__header" @click="${this.toggleOpen}">
                <span class="card__title"><i class="icon">${discussionIcon}</i>&nbsp; ${this.label}</span>
                <i class="icon arrow-down">${downArrow}</i>
                <i class="icon arrow-up">${upArrow}</i>
            </div>
            <div class="card__content">
                <div class="jina-qabot__answer-block">
                    ${this.getAnswerBlock()}
                </div>
                <div class="jina-qabot__control">
                    <textarea maxlength="100" rows="3"
                        ?disabled="${!(this.qaControl?.ready)}"
                        @keypress="${this.onTextAreaInput}"
                        placeholder="${this.server ? 'Type your question here...' : 'Waiting for server configuration...'}"></textarea>
                    <button title="Submit" ?disabled="${!(this.qaControl?.ready)}" @click="${this.submitQuestion}">
                        <i class="icon icon-plane">${paperPlane}</i>
                    </button>
                    <div class="powered-by"><i class="icon icon-powered-by-jina">${poweredByJina}</i></div>
                </div>
            </div>
        </div>
    `;
    }
}
