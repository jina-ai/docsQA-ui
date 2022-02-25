import { html } from 'lit';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';

export function renderPreferenceText(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${(this.preferences.texts as any)[qa?.answer?.textKey] || 'Unknown preference text'}</p>
    </div>`;
}
