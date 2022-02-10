import { QAPair, DocQAAnswer } from './shared';
export declare function makeTextFragmentUriFromPassage(text?: string, paragraph?: string, uri?: string): string | undefined;
export declare function transformAnswerUriAddTextFragments(this: DocQAAnswer, _qaPair: QAPair): void;
