import { QaBot } from './qa-bot/qa-bot';

export { QaBot } from './qa-bot/qa-bot';

customElements.define('qa-bot', QaBot);

declare global {
    export interface HTMLElementTagNameMap {
        'qa-bot': QaBot,
    }
}

export default QaBot;
