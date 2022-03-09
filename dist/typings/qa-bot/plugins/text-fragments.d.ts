import { QAPair, DocQAAnswer } from './shared';
export declare function makeTextFragmentUriFromPassage(text?: string, paragraph?: string, uri?: string, omitSuffix?: boolean): string | undefined;
export declare function transformAnswerUriAddTextFragments(this: DocQAAnswer, _qaPair: QAPair): void;
