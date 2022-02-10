import { QAPair } from '../shared';
import type { QaBot } from '../qa-bot';

export type AnswerRenderer = (this: QaBot, qaPair: QAPair) => any;
