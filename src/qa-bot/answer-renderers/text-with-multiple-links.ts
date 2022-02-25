import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithMultipleLinks(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
        <ul class="multiple-links">
            ${qa.answer?.matches?.map((x) => html`
            <a href="${this.makeReferenceLink(x?.uri)}">
                <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">${x?.text}</p>
            </a>
            `)}
        </ul>
    </div>
    `;


}
