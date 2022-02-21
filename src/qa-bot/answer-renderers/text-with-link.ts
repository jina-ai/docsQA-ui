import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';
import { linkIcon, thumbUp, thumbDown } from '../svg-icons';

export function renderTextWithLink(this: QaBot, qa: QAPair) {

    let textVec = html`<p style="white-space: pre-line">&#8203;${qa.answer?.text}&#8203;</p>`;

    if (qa.answer?.tags?.answerVec) {
        const [a, b, c] = qa.answer.tags.answerVec;
        // Note that `&#8203;` stands for zero-width white space.
        // This is to prevent highlighting the answer text itself. If the chat bot is on the same page with the source.
        textVec = html`<p class="hl-enabled" style="white-space: pre-line">${a}&#8203;<span class="hl" style="font-weight: bold">&#8203;${b}</span>${c}</p>`;
    }


    return html`
    <div class="talktext">
        ${textVec}
    </div>
    <div class="feedback-tooltip">
        ${qa.error ? html`
        <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
        ` : ''}
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}"
            href="${this.makeReferenceLink(qa.answer.uri)}" target="${this.target as any}">Source<i
                class="icon link">${linkIcon}</i></a>
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
