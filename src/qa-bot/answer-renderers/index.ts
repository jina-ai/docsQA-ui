import { ANSWER_RENDER_TEMPLATE } from '../shared';

import { renderText } from './text';
import { renderTextWithLink } from './text-with-link';
import { renderTextWithMultipleLinks } from './text-with-multiple-links';
import { renderPreferenceText } from './preference-text';
import { renderError } from './error';
import { renderUnknownAnswerText } from './unknown-answer-text';


export const ANSWER_RENDERER_MAP = {
    [ANSWER_RENDER_TEMPLATE.TEXT]: renderText,
    [ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK]: renderTextWithLink,
    [ANSWER_RENDER_TEMPLATE.TEXT_WITH_MULTIPLE_LINKS]: renderTextWithMultipleLinks,
    [ANSWER_RENDER_TEMPLATE.PREFERENCE_TEXT]: renderPreferenceText,
    [ANSWER_RENDER_TEMPLATE.ERROR]: renderError,
    [ANSWER_RENDER_TEMPLATE.UNKNOWN_ANSWER_TEXT]: renderUnknownAnswerText,
};

export * from './shared';

export { renderText } from './text';
export { renderTextWithLink } from './text-with-link';
export { renderTextWithMultipleLinks } from './text-with-multiple-links';
export { renderPreferenceText } from './preference-text';
export { renderError } from './error';
export { renderUnknownAnswerText } from './unknown-answer-text';
