import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithLink(this: QaBot, qa: QAPair) {

    let textVec = html`<p>${qa.answer?.text}</p>`;

    if (qa.answer?.tags?.answerVec) {
        const [a, b, c] = qa.answer.tags.answerVec;
        textVec = html`<p class="hl-enabled">${a}<span class="hl" style="font-weight: bold">${b}</span>${c}</p>`;
    }


    return html`
    <div class="talktext">
        ${textVec}
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}" href="${this.makeReferenceLink(qa.answer.uri)}"
            target="${this.target as any}">Click here to view source </a>
        ` : ''}
    </div>
    `;

}
