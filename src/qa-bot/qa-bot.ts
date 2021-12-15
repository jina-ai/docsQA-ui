import { LitElement, html, css, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { throttle } from '../lib/decorators/throttle';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController, QAPair } from './controller';
import masterStyle from './style';
import { discussionIcon, downArrow, paperPlane, poweredByJina, thumbDown, thumbUp, tripleDot, upArrow } from './svg-icons';

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
    theme?: string = 'auto';

    @property({attribute: 'animate-by', type: String, reflect: true })
    animateBy?: 'position' | 'height' = 'height';

    // @property({ type: Boolean })
    // manual?: boolean;

    @property({ type: Boolean, reflect: true })
    open?: boolean;

    qaControl?: JinaQABotController;

    @query('.jina-qabot__control textarea')
    textarea?: HTMLTextAreaElement;

    constructor() {
        super();

    }

    static override styles = [
        resetCSS,
        customScrollbarCSS,
        masterStyle,
        css`
  `
    ];

    override update(changedProps: PropertyValues) {
        if (changedProps.has('server') && this.server) {
            this.qaControl = new JinaQABotController(this, this.server);
        }
        super.update(changedProps);
    }

    onTextAreaInput(event: KeyboardEvent) {
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
    async submitFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none' = 'none') {
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
        this.renderRoot?.querySelector('.qa-pair:last-child')?.scrollIntoView({
            block: "end",
            inline: "end"
        });
    }

    getSingleQAComp(qa: QAPair) {
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

    getAnswerBlock() {
        if (!(this.qaControl?.qaPairs.length)) {
            return html`
            <div class="answer-hint">
                <slot>
                    <h3>You can ask questions about our docs. Try:</h3>
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
        <div class="jina-qabot card" ?busy="${!(this.qaControl?.ready)}">
            <div class="card__header" @click="${()=> this.open = !this.open}">
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
                        placeholder="${this.server ? 'Type your question here...' : 'Waiting for server configuration...'}"
                        autofocus></textarea>
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
