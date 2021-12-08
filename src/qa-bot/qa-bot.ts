import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { discussionIcon, downArrow, paperPlane, thumbDown, thumbUp, tripleDot, upArrow } from './svg-icons';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

const SEARCH_ENDPOINT = '/search';
const SLACK_ENDPOINT = '/slack';

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

    constructor() {
        super();
    }

    static override styles = css`
    .jina-doc-bot {
        position: fixed !important;
        bottom: 0;
        width: 16rem;
        background: var(--color-background-primary);;
    }

    .jina-doc-bot .sd-summary-title {
        font-weight: normal !important;
    }

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

    .jina-doc-answer-dialog {
        height: 25vh;
        overflow-y: scroll;
        scroll-behavior: smooth;
    }

    .jina-doc-answer-hint {
        height: 25vh;
        padding: 1rem;
        overflow-y: scroll;
        scroll-behavior: smooth;
    }

    .jina-doc-bot-controls {
        border-color: var(--color-brand-primary) !important;
        border-radius: .25rem;
        overflow: hidden;
        margin: 0 1rem;
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
        /* remove webkit p margins */
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        overflow-wrap: anywhere;
    }

    .answer-bubble {
        color: var(--color-code-background);
    }

    @keyframes blink {
        50% {
            fill: transparent
        }
    }

    .dot {
        animation: 1s blink infinite;
        fill: var(--color-background-primary);
    }

    .dot:nth-child(2) {
        animation-delay: 250ms
    }

    .dot:nth-child(3) {
        animation-delay: 500ms
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
  `;

    override render() {
        const qa = {};

        return html`
    <details class="jina-doc-bot sd-sphinx-override sd-dropdown sd-card" v-bind:class="{ready: ready}">
        <summary class="sd-summary-title sd-card-header">
            ${discussionIcon}
            &nbsp; Ask our docs!
            <div class="sd-summary-down docutils">
                ${downArrow}
            </div>
            <div class="sd-summary-up docutils">
                ${upArrow}
            </div>
        </summary>
        <div class="sd-summary-content docutils">
            <div class="jina-doc-answer">
                <div class="jina-doc-answer-hint" v-if="qa_pairs.length===0">
                    <p class="jina-doc-bot-help-text sd-font-weight-bold" v-if="!ready">Chat loading...<br><br> You can
                        think of questions while our bot load. Try:</p>
                    <p class="jina-doc-bot-help-text sd-font-weight-bold hidden-before-ready" v-else>You can ask questions
                        about our docs. Try:</p>
                    <ul class="example-question simple sd-font-weight-light">
                        <li>
                            <p>Does Jina support Kubernetes?</p>
                        </li>
                        <li>
                            <p>How can I traverse a nested DocumentArray?</p>
                        </li>
                        <li>
                            <p>What are the basic concepts in Jina?</p>
                        </li>
                    </ul>
                </div>
                <div class="jina-doc-answer-dialog hidden-before-ready" v-else>
                    <div v-for="qa in qa_pairs" class="qa-container">
                        <div v-if="qa.question" class="sd-text-right">
                            <div class="talk-bubble question-bubble">
                                <div class="talktext">
                                    <p>\${qa.question}</p>
                                </div>
                            </div>
                        </div>
                        <div class="talk-bubble answer-bubble">
                            <div class="talktext">
                                <p v-if="qa.answer">\${qa.answer.text}</p>
                                <div v-else>
                                    ${tripleDot}
                                </div>
                            </div>
                            <a v-if="qa.answer && is_conn_broken" class="answer-reference" href="https://slack.jina.ai"
                                target="_blank">Report</a>
                            <div v-if="qa.answer && !is_conn_broken && qa.answer.uri"
                                class="feedback-tooltip sd-d-flex-row">
                                <a class="answer-reference" :href="root_url + qa.answer.uri">Source</a>
                                <div class="sd-d-flex-row">
                                    <div class="thumb-answer thumbup" v-show="qa.rating===null" style="margin: 0 6px"
                                        v-on:click="submit_rating(qa, true)">
                                        ${thumbUp}
                                    </div>
                                    <div class="thumb-answer thumbdown" v-show="qa.rating===null"
                                        v-on:click="submit_rating(qa, false)">
                                        ${thumbDown}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
            <div class="jina-doc-bot-controls sd-d-flex-row sd-border-1">
                <textarea v-model="cur_question" class="sd-border-0" maxlength="100" rows="3" id="bot-input-question"
                    style="width: 100%" placeholder="Just a moment, please ..." :placeholder="'Type your question here'"
                    v-on:keyup.enter="submit_q" disabled :disabled="!ready" :readonly="is_busy" autofocus></textarea>
                <button
                    class="sd-sphinx-override sd-btn sd-text-wrap sd-btn-outline-primary sd-rounded-0 hidden-before-ready"
                    v-on:click="submit_q" v-show="cur_question.length>0 && !is_busy" id="bot-input-btn">
                    ${paperPlane}
                </button>
            </div>
            <div class="powered-by">
            </div>
        </div>
    </details>
    `;
    }
}
