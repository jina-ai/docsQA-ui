import { html } from 'lit';
import type { QaBot } from '../qa-bot';
import { QAPair } from '../shared';

export function renderError(this: QaBot, qa: QAPair) {

    let errorTextKey = 'unknownError';
    const errorText = `${qa.error}`;
    if (errorText.includes('Failed to fetch')) {
        errorTextKey = 'networkError';
        if ((qa.error as any)?.status >= 500) {
            errorTextKey = 'serverError';
        }
    } else if (errorText.includes('UpstreamError')) {
        errorTextKey = 'serverError';
    }
    if (qa.error) {
        console.warn(qa.error);
    }

    return html`
    <div class="talktext">
        <p style="white-space: pre-line">${(this.preferences.texts as any)[errorTextKey] || 'Unknown error'}</p>
    </div>`;
}
