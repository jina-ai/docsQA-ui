import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithLink(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
        ${qa.answer?.uri ? html`
        <a class="answer-reference" @click="${() => this.setQaPairTargeted(qa)}" href="${this.makeReferenceLink(qa.answer.uri)}"
            target="${this.target as any}">Click here to view source </a>
        ` : ''}
    </div>
    `;

}
