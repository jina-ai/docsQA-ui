import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';
import { thumbUp, thumbDown } from '../svg-icons';

export function renderTextWithMultipleLinks(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
        <ul style="padding-top: 0.5em;">
            ${qa.answer?.matches?.map((x) => html`
            <a href="${this.makeReferenceLink(x?.uri)}" style="line-height: 2em;">
                <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; padding-right: 1em;">${x?.text}</p>
            </a>
            `)}
        </ul>
    </div>
    <div class="feedback-tooltip">
        ${(qa.question && qa.answer) ? html`
        <a class="answer-reference" href="#" target="_blank"> </a>
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
