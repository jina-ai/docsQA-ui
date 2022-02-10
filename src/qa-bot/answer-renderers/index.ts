import { ANSWER_RENDER_TEMPLATE } from '../shared';

import { renderText } from './text';
import { renderTextWithLink } from './text-with-link';
import { renderTextWithMultipleLinks } from './text-with-multiple-links';


export const ANSWER_RENDERER_MAP = {
    [ANSWER_RENDER_TEMPLATE.TEXT]: renderText,
    [ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK]: renderTextWithLink,
    [ANSWER_RENDER_TEMPLATE.TEXT_WITH_MULTIPLE_LINKS]: renderTextWithMultipleLinks,
};

export * from './shared';

export { renderText } from './text';
export { renderTextWithLink } from './text-with-link';
export { renderTextWithMultipleLinks } from './text-with-multiple-links';
