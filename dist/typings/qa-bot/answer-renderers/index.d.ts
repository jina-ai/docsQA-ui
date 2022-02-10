import { renderText } from './text';
import { renderTextWithLink } from './text-with-link';
import { renderTextWithMultipleLinks } from './text-with-multiple-links';
export declare const ANSWER_RENDERER_MAP: {
    text: typeof renderText;
    "text-with-link": typeof renderTextWithLink;
    "text-with-multiple-links": typeof renderTextWithMultipleLinks;
};
export * from './shared';
export { renderText } from './text';
export { renderTextWithLink } from './text-with-link';
export { renderTextWithMultipleLinks } from './text-with-multiple-links';
