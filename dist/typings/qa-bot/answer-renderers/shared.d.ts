import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';
export declare type AnswerRenderer = (this: QaBot, qaPair: QAPair) => any;
