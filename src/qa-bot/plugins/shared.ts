import { DocQAAnswer } from '../../lib/jina-docbot-rpc';
import { QAPair } from '../shared';

export interface PluginContext extends DocQAAnswer { }

export type AnswerProcessingPlugin = (this: PluginContext, qaPair: QAPair) => QAPair | void;

export { QAPair, ANSWER_RENDER_TEMPLATE } from '../shared';
export { DocQAAnswer, JinaDocBotRPC, DOCQA_ANSWER_STATUS } from '../../lib/jina-docbot-rpc';
