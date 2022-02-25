import { html } from 'lit';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';

const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined

export function renderPreferenceText(this: QaBot, qa: QAPair) {

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${getRandomElement((this.preferences.texts as any)[qa?.answer?.textKey]) || 'Unknown preference text'}</p>
    </div>`;
}
