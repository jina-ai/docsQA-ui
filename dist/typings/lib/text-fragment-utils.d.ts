export const TEXT_FRAGMENT_CSS_CLASS_NAME: "text-fragments-polyfill-target-text";
export function getFragmentDirectives(hash: string): {
    text: string[];
};
export function parseFragmentDirectives(fragmentDirectives: {
    text: string[];
}): {
    text: TextFragment[];
};
export function processFragmentDirectives(parsedFragmentDirectives: {
    text: TextFragment[];
}): {
    text: (Element[])[];
};
export function processTextFragmentDirective(textFragment: TextFragment): Ranges[];
export function removeMarks(marks: Node[]): void;
export function markRange(range: Range): Element[];
export function scrollElementIntoView(element: Element): void;
export namespace forTesting {
    export { advanceRangeStartPastOffset };
    export { advanceRangeStartToNonWhitespace };
    export { findRangeFromNodeList };
    export { findTextInRange };
    export { getBoundaryPointAtIndex };
    export { isWordBounded };
    export { makeNewSegmenter };
    export { markRange };
    export { normalizeString };
    export { parseTextFragmentDirective };
    export { forwardTraverse };
    export { backwardTraverse };
    export { getAllTextNodes };
    export { acceptTextNodeIfVisibleInRange };
}
export namespace internal {
    export { BLOCK_ELEMENTS };
    export { BOUNDARY_CHARS };
    export { NON_BOUNDARY_CHARS };
    export { acceptNodeIfVisibleInRange };
    export { normalizeString };
    export { makeNewSegmenter };
    export { forwardTraverse };
    export { backwardTraverse };
    export { makeTextNodeWalker };
    export { isNodeVisible };
}
export function applyTargetTextStyle(): void;
export function setDefaultTextFragmentsStyle({ backgroundColor, color }: Object): void;
export type ElementFilterFunction = (element: HTMLElement) => number;
export type TextFragment = {
    textStart: string;
    textEnd?: string | undefined;
    prefix?: string | undefined;
    suffix?: string | undefined;
};
export type BoundaryPoint = {
    node: Node;
    offset: number;
};
declare function advanceRangeStartPastOffset(range: Range, node: Node, offset: number): void;
declare function advanceRangeStartToNonWhitespace(range: Range): void;
declare function findRangeFromNodeList(query: string, range: Range, textNodes: Node[], segmenter?: any): Range;
declare function findTextInRange(query: string, range: Range): Range | undefined;
declare function getBoundaryPointAtIndex(index: number, textNodes: Node[], isEnd: bool): BoundaryPoint;
declare function isWordBounded(text: string, startPos: number, length: number, segmenter?: any): bool;
declare function makeNewSegmenter(): Intl.Segmenter | undefined;
declare function normalizeString(str: string): string;
declare function parseTextFragmentDirective(textFragment: string): TextFragment;
declare function forwardTraverse(walker: TreeWalker, finishedSubtrees: Set<any>): Node;
declare function backwardTraverse(walker: TreeWalker, finishedSubtrees: Set<any>): Node;
declare function getAllTextNodes(root: Node, range: Range): Array<string[]>;
declare function acceptTextNodeIfVisibleInRange(node: Node, range: Range): NodeFilter;
declare const BLOCK_ELEMENTS: string[];
declare const BOUNDARY_CHARS: RegExp;
declare const NON_BOUNDARY_CHARS: RegExp;
declare function acceptNodeIfVisibleInRange(node: Node, range: Range | undefined): NodeFilter;
declare function makeTextNodeWalker(range: Range): TreeWalker;
declare function isNodeVisible(node: Node): boolean;
export {};
