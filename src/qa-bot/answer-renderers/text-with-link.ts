import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';
import { linkIcon, thumbUp, thumbDown } from '../svg-icons';

export function renderTextWithLink(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
    </div>
    <div class="feedback-tooltip">
        ${qa.error ? html`
        <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
        ` : ''}
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}" href="${this.makeReferenceLink(qa.answer.uri)}"
            target="${this.target as any}">Source<i class="icon link">${linkIcon}</i></a>
        ` : ''}
        ${(qa.question && qa.answer) ? html`
        <div class="thumbs">
            <button class="thumb thumbup" ?active="${qa.feedback === true}" @click="${() => this.submitFeedback(qa, 'up')}">
                <i class="icon icon-thumb-up">${thumbUp}</i>
            </button>
            <button class="thumb thumbdown" ?active="${qa.feedback === false}"
                @click="${() => this.submitFeedback(qa, 'down')}">
                <i class="icon icon-thumb-down">${thumbDown}</i>
            </button>
        </div>
        ` : ''}
    </div>`;

}
