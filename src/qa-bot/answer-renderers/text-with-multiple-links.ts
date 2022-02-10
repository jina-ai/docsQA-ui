import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';
import { thumbUp, thumbDown, linkIcon } from '../svg-icons';

export function renderTextWithMultipleLinks(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
        <ul style="padding-top: 0.5em;">
            ${qa.answer?.matches?.map((x) => html`
            <a href="${this.makeReferenceLink(x?.uri)}" style="line-height: 2em; display: flex; align-items: center; ">
                <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${x?.text}</p>
                <i class="icon link" style="width: 1em; height: 1em; margin: 0 0.5em; ">${linkIcon}</i>
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
