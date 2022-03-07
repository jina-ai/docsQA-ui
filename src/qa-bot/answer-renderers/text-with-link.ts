import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithLink(this: QaBot, qa: QAPair) {
    // Note that `\u200b` and `&#8203;` stands for zero-width white space.
    // This is to prevent highlighting the answer text itself. If the chat bot is on the same page with the source.
    let answerText = qa.answer?.text || '';
    answerText = `${answerText.substring(0, answerText.length - 1)}\u200b${answerText[answerText.length - 1] || ''}`;

    let textVec = html`<p style="white-space: pre-line">${answerText}</p>`;

    if (qa.answer?.tags?.answerVec) {
        const [a, _b, c] = qa.answer.tags.answerVec;
        let b: string = _b;
        if (`${a}${c}`.replace(/\s/g, '').length === 0) {
            b = `${b.substring(0, b.length - 1)}\u200b${b[b.length - 1] || ''}`;
        }
        textVec = html`<p class="hl-enabled" style="white-space: pre-line">${a}&#8203;<span class="hl"
        style="font-weight: bold">${b}</span>&#8203;${c}</p>`;
    }


    return html`
    <div class="talktext">
        ${textVec}
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}"
            href="${this.makeReferenceLink(qa.answer.uri)}" target="${this.target as any}">See context</a>
        ` : ''}
    </div>
    `;
}
