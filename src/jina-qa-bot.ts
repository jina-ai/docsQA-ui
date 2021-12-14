import { QaBot } from './qa-bot/qa-bot';

customElements.define('jina-qa-bot', QaBot);

declare global {
    export interface HTMLElementTagNameMap {
        "jina-qa-bot": QaBot,
    }
}

export default QaBot;
