import get from 'lodash-es/get';
import { QAPair, DocQAAnswer } from './shared';

function patchTextFragmentEncoding(text: string) {
    return encodeURIComponent(text).replace(/-/g, '%2D');
}

const nativeTextFragments = 'fragmentDirective' in document;

export function makeTextFragmentUriFromPassage(text?: string, paragraph?: string, uri?: string) {
    if (!(text && paragraph && uri)) {
        return uri;
    }

    const [prefix, suffix] = paragraph.split(text);

    const prefixFragment = prefix.match(/\b\w.{0,15}$/)?.[0].trim();
    const suffixFragment = (suffix || '').trim().match(/^\S.{0,14}\b/)?.[0].trim();

    const fragment = `:~:text=${prefixFragment ? `${patchTextFragmentEncoding(prefixFragment)}-,` : ''}${patchTextFragmentEncoding(text)}${suffixFragment ? `,-${patchTextFragmentEncoding(suffixFragment)}` : ''}`;

    const parsedUri = new URL(uri, window.location.href);
    if (!parsedUri.hash) {
        return `${uri}#${fragment}`;
    }

    if (uri.endsWith('#')) {
        return `${uri}${fragment}`;
    }

    return `${uri}${fragment}`;
}

export function transformAnswerUriAddTextFragments(this: DocQAAnswer, _qaPair: QAPair) {
    if (!this.matches.length) {
        return;
    }

    for (const match of this.matches) {

        if (!(match.tags?.uri_same_origin) && !nativeTextFragments) {
            continue;
        }

        const paragraph: string = get(match, 'tags.paragraph', '');

        if (!paragraph) {
            continue;
        }

        const sentenceStart = get(match, 'tags.sentence_start');
        const sentenceEnd = get(match, 'tags.sentence_end');
        let spanStart = get(match, 'tags.span_start');
        let spanEnd = get(match, 'tags.span_end');

        let answerText = match.text || '';
        if (Number.isInteger(spanStart) && Number.isInteger(spanEnd)) {
            // Fix potential span issue

            while (true) {
                if (spanStart >= spanEnd) {
                    break;
                }
                if (paragraph[spanStart]?.match(/\s/)) {
                    spanStart++;
                    continue;
                }
                break;
            }
            while (true) {
                if (spanEnd >= paragraph.length) {
                    break;
                }
                if (paragraph[spanEnd]?.match(/\S/)) {
                    spanEnd++;
                    continue;
                }
                break;
            }
            const fromSpans = paragraph.substring(spanStart, spanEnd);
            if (fromSpans) {
                answerText = fromSpans;
            }
        }

        let sentence = '';
        if (Number.isInteger(sentenceStart) && Number.isInteger(sentenceEnd)) {
            sentence = paragraph.substring(sentenceStart, sentenceEnd);
        }

        const sentenceWords = sentence.split(/\s+/g);
        const answerWords = answerText.split(/\s+/g);

        let textFragmentContext = paragraph;

        if (sentence && (sentenceWords.length - answerWords.length >= 3)) {
            // Sentence have 3 more words than answer. Sentence is enough to be the context.
            textFragmentContext = sentence;
        }

        if (answerWords.length >= 6) {
            // If the answer have enough words, dont use the context at all.
            textFragmentContext = '';
        }

        if (answerText.match(/([\s\W]+)\s*$/)) {
            // Answer ends with punctuation
            // Don't trust the punctuation. Could be added by transformers.
            answerText = answerText.replace(/([\s\W]+)\s*$/, '');

            // We've modified the answer text, context doesn't make sense anymore.
            textFragmentContext = '';
        }

        if (!textFragmentContext) {
            const patched = makeTextFragmentUriFromPassage(answerText, answerText, match.uri);
            if (patched) {
                if (!match.tags) {
                    match.tags = {};
                }
                match.tags.original_uri = match.uri;
                match.uri = patched;
                continue;
            }
        }

        const patched = makeTextFragmentUriFromPassage(answerText, textFragmentContext, match.uri);
        if (patched) {
            if (!match.tags) {
                match.tags = {};
            }
            match.tags.original_uri = match.uri;
            match.uri = patched;
        }
    }
}
