import { html } from 'lit';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';


export function renderUnknownAnswerText(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${this.preferences.texts.unknownAnswerText}</p>
        ${this.preferences.texts.unknownAnswerUrl ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}"
            href="${this.makeReferenceLink(this.preferences.texts.unknownAnswerUrl)}" target="${this.target as any}">${this.preferences.texts.unknownAnswerLink}</a>
        ` : ''}
    </div>`;
}
