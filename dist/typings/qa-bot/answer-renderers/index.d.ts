import { renderText } from './text';
import { renderTextWithLink } from './text-with-link';
import { renderTextWithMultipleLinks } from './text-with-multiple-links';
import { renderPreferenceText } from './preference-text';
import { renderError } from './error';
export declare const ANSWER_RENDERER_MAP: {
    text: typeof renderText;
    "text-with-link": typeof renderTextWithLink;
    "text-with-multiple-links": typeof renderTextWithMultipleLinks;
    "preference-text": typeof renderPreferenceText;
    error: typeof renderError;
};
export * from './shared';
export { renderText } from './text';
export { renderTextWithLink } from './text-with-link';
export { renderTextWithMultipleLinks } from './text-with-multiple-links';
export { renderPreferenceText } from './preference-text';
export { renderError } from './error';
