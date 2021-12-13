import { LitElement, html, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController, QAPair } from './controller';
import masterStyle from './style';
import { discussionIcon, downArrow, paperPlane, poweredByJina, thumbDown, thumbUp, tripleDot, upArrow } from './svg-icons';

export interface QaBotConfig {

}

export class QaBot extends LitElement {
    @property({ type: String }) override title = 'My app';

    ready: boolean = false;
    loading: boolean = false;
    broken: boolean = false;

    @property({ type: String })
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ type: Boolean })
    manual?: boolean;

    @property({ attribute: false })
    config?: QaBotConfig;

    @property({ type: Boolean, reflect: true })
    open?: boolean;

    qaControl?: JinaQABotController;

    constructor() {
        super();

    }

    static override styles = [
        resetCSS,
        customScrollbarCSS,
        masterStyle,
        css`
    .toc-drawer {
        padding-right: 0;
    }

    .example-question {
        color: var(--color-foreground-muted);
    }

    .jina-doc-answer {
        font-size: 0.7em;
    }

    #bot-input-question {
        font-size: .7em;
        background: inherit;
        color: inherit;
        padding: .5rem;
    }

    #bot-input-btn {
        padding: .5rem .5rem;
        border: none !important;
    }


    /* CSS talk bubble */
    .talk-bubble {
        display: inline-block;
        position: relative;
        height: auto;
        background-color: var(--color-brand-primary);
        margin-bottom: 20px;
        border-radius: 5px;
        max-width: 80%;
    }

    .qa-container {
        padding: 1rem;
    }

    .question-bubble {
        background-color: var(--color-background-border);
    }

    .answer-bubble:after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
        left: 0;
        right: auto;
        top: auto;
        bottom: -10px;
        border: 10px solid;
        border-color: transparent transparent transparent var(--color-brand-primary);
    }

    .question-bubble:after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
        left: auto;
        right: 0;
        top: auto;
        bottom: -10px;
        border: 10px solid;
        border-color: var(--color-background-border) var(--color-background-border) transparent transparent;
    }


    /* talk bubble contents */
    .talktext {
        padding: 1em;
        text-align: left;
    }

    .talktext p {
        overflow-wrap: anywhere;
    }

    .answer-bubble {
        color: var(--color-code-background);
    }

    .loader {
        color: var(--color-background-primary);
    }

    .thumb-answer {
        color: var(--color-background-border);
    }

    .thumb-answer:hover {
        color: var(--color-brand-primary);
    }

    .feedback-tooltip {
    bottom: -20px;
    position: absolute;
    left: 20px;

    display: flex;
    justify-content: space-between;
    width: calc(100% - 20px - 12px)
    }

    .answer-reference {
    white-space: nowrap;
    }

    .answer-reference:after {
        content: url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23607D8B' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M0 0h24v24H0z' stroke='none'/%3E%3Cpath d='M11 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M10 14L20 4M15 4h5v5'/%3E%3C/svg%3E");
        margin: 0 .25rem;
        vertical-align: middle;
        color: var(--color-sidebar-link-text);
    }

    .powered-by {
        background: url(./Powered-by-Jina-Large-Basic.svg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 1rem;
    }

    .hidden-before-ready{
        display: none;
    }

    .ready .hidden-before-ready{
        display: revert;
    }

    @media (prefers-color-scheme: dark) {
        .powered-by {
            background: url(./Powered-by-Jina-Large-Basic.svg);
        }
    }
  `
    ];

    override update(changedProps: PropertyValues) {
        if (changedProps.has('server') && this.server) {
            this.qaControl = new JinaQABotController(this, this.server);
        }
        super.update(changedProps);
    }

    getSingleQAComp(qa: QAPair) {
        return html`
            <div class="qa-container">
                <div class="talk-bubble question-bubble">
                    <div class="talktext">
                        <p>${qa.question}</p>
                    </div>
                </div>
                <div class="talk-bubble answer-bubble">
                    <div class="talktext">
                        ${
                            qa.answer ?
                                html`<p>${qa.answer.text}</p>` :
                                html`<div>${tripleDot}</div>`
                        }
                    </div>
                    ${qa.answer && this.broken ? html`
                        <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
                    `:'' }
                    ${qa.answer?.uri ? html`
                        <div class="feedback-tooltip sd-d-flex-row">
                            <a class="answer-reference" href="${this.site || '/' + qa.answer.uri}">Source</a>
                            <div class="sd-d-flex-row">
                                <div class="thumb-answer thumbup" v-show="qa.rating===null" style="margin: 0 6px"
                                    v-on:click="submit_rating(qa, true)">
                                    ${thumbUp}
                                </div>
                                <div class="thumb-answer thumbdown" v-show="qa.rating===null" v-on:click="submit_rating(qa, false)">
                                    ${thumbDown}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
    `;
    }

    getAnswerBlock() {
        if (!(this.qaControl?.qaPairs.length)) {
            return html`
            <div class="jina-doc-answer-hint">
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
            <div class="jina-doc-answer-dialog hidden-before-ready">
                ${this.qaControl?.qaPairs.map((qa) => this.getSingleQAComp(qa))}
            </div>
        `;
    }

    override render() {

        return html`
        <div class="jina-doc-bot card">
            <div class="card__header" @click="${()=> this.open = !this.open}">
                <span class="card__title"><i class="icon">${discussionIcon}</i>&nbsp; Ask our docs!</span>
                <i class="icon arrow-down">${downArrow}</i>
                <i class="icon arrow-up">${upArrow}</i>
            </div>
            <div class="card__content">
                <div class="jina-doc-bot__answer-block">
                    ${this.getAnswerBlock()}
                </div>
                <div class="jina-doc-bot__control">
                    <textarea maxlength="100" rows="3"
                        placeholder="Type your question here"
                        autofocus></textarea>
                    <button
                        v-show="cur_question.length>0 && !is_busy" id="bot-input-btn">
                        <i class="icon icon-plane">${paperPlane}</i>
                    </button>
                </div>
            </div>

            <div class="powered-by"><i class="icon icon-powered-by-jina">${poweredByJina}</i></div>
        </div>
    `;
    }
}
