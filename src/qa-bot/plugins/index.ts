import { transformAnswerUriFixUri } from './fix-uris';
import { transformAnswerUriAddTextFragments } from './text-fragments';
import { mangleAnswerByStatus } from './protocol-status';

export * from './shared';

export const ANSWER_PROCESSING_PLUGINS = [
    transformAnswerUriFixUri,
    transformAnswerUriAddTextFragments,
    mangleAnswerByStatus,
];
