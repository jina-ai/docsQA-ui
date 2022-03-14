import { html } from 'lit';
import { randomPick } from '../../lib/random';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';


export function renderPreferenceText(this: QaBot, qa: QAPair) {

    let text = qa?.answer?.text;
    if (!text && qa?.answer?.textKey) {
        const preferenceText: string | string[] | void = (this.preferences.texts as any)[qa.answer.textKey];
        const preferenceTextPrefix: string | void = (this.preferences.texts as any)[qa.answer.textKey + '_Prefix'];
        const preferenceTextSuffix: string | void = (this.preferences.texts as any)[qa.answer.textKey + '_Suffix'];
        if (Array.isArray(preferenceText)) {
            text = (preferenceTextPrefix || '') + randomPick(preferenceText) + (preferenceTextSuffix || '');
        } else if (preferenceText) {
            text = (preferenceTextPrefix || '') + preferenceText + (preferenceTextSuffix || '');
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
