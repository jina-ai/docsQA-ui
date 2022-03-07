import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithLink(this: QaBot, qa: QAPair) {
    // Note that `\ufeff` and `&#xfeff;` stands for zero-width white space.
    // This is to prevent highlighting the answer text itself. If the chat bot is on the same page with the source.
    let answerText = qa.answer?.text || '';
    answerText = `${answerText.substring(0, answerText.length - 1)}\ufeff${answerText[answerText.length - 1] || ''}`;

    let textVec = html`<p style="white-space: pre-line">${answerText}</p>`;

    if (qa.answer?.tags?.answerVec) {
        const [a, _b, c] = qa.answer.tags.answerVec;
        let b: string = _b;
        let i = 0;
        for (; i < b.length; i++) {
            if (/\S/.test(b[i])) {
                break;
            }
        }
        if (`${a}${c}`.replace(/\s/g, '').length === 0) {
            b = `${b.substring(0, i + 1)}\ufeff${b.substring(i + 1)}`;
        }
        textVec = html`<p class="hl-enabled" style="white-space: pre-line">${a}&#xfeff;<span class="hl"
        style="font-weight: bold">${b}</span>&#xfeff;${c}</p>`;
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
