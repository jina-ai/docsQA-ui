import { html } from 'lit';
import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export function renderTextWithMultipleLinks(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p>${qa.answer?.text}</p>
        <ul style="padding-top: 0.5em;">
            ${qa.answer?.matches?.map((x) => html`
            <a href="${this.makeReferenceLink(x?.uri)}" style="display: flex; align-items: center; ">
                <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${x?.text}</p>
            </a>
            `)}
        </ul>
    </div>
    `;


}
