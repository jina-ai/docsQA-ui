export interface TextFragment {
    textStart: string;
    textEnd: string;
    prefix: string;
    suffix: string;
}

export const TEXT_FRAGMENT_CSS_CLASS_NAME =
    'text-fragments-polyfill-target-text';

export function getFragmentDirectives(hash: string): { text: string[]; };

export function parseFragmentDirectives(fragmentDirectives: { text: string[]; }): { text: TextFragment[]; };

export function processFragmentDirectives(
    parsedFragmentDirectives: { text: TextFragment[]; }
): { text: (Element[])[]; };

export function processTextFragmentDirective(textFragment: TextFragment): Range[];

export function removeMarks(marks: Node[]): void;

export function markRange(range: Range): Element[];

export function scrollElementIntoView(element: Element): void;

export function applyTargetTextStyle(): void;

export function setDefaultTextFragmentsStyle(options: { backgroundColor: string; color: string; }): void;
