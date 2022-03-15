import { html } from 'lit';
import { randomPick } from '../../lib/random';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';


export function renderPreferenceText(this: QaBot, qa: QAPair) {

    let text = qa?.answer?.text;
    if (!text && qa?.answer?.textKey) {
        const preferenceText: string | string[] | void = (this.preferences.texts as any)[qa.answer.textKey];
        if (Array.isArray(preferenceText)) {
            text = randomPick(preferenceText);
        } else if (preferenceText) {
            text = preferenceText;
        }

        if (text) {
            // Dereference the text key.
            // This prevents re-random when web-component re-renders.
            qa.answer.text = text;
        }
    }

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${text || 'Unknown preference text'}</p>
    </div>`;
}
