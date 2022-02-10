import { html } from 'lit';
import { QAPair } from '../shared';

export function renderText(qa: QAPair) {

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${qa.answer?.text}</p>
    </div>`;
}
