import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

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
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}" href="${this.makeReferenceLink(qa.answer.uri)}"
            target="${this.target as any}">Click here to view source </a>
        ` : ''}
    </div>
    `;

}
