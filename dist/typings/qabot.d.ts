import { QaBot } from './qa-bot/qa-bot';
export { QaBot } from './qa-bot/qa-bot';
declare global {
    export interface HTMLElementTagNameMap {
        'qa-bot': QaBot;
    }
}
export default QaBot;
