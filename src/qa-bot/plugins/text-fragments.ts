import get from 'lodash-es/get';
import { QAPair, DocQAAnswer } from './shared';

function patchTextFragmentEncoding(text: string) {
    return encodeURIComponent(text).replace(/-/g, '%2D');
}

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

        const paragraph: string = get(match, 'tags.paragraph');

        if (!paragraph) {
            continue;
        }

        const sentenceStart = get(match, 'tags.sentence_start');
        const sentenceEnd = get(match, 'tags.sentence_end');
        const spanStart = get(match, 'tags.span_start');
        const spanEnd = get(match, 'tags.span_end');

        let answerText = match.text;
        if (Number.isInteger(spanStart) && Number.isInteger(spanEnd)) {
            answerText = paragraph.slice(spanStart, spanEnd);
        }

        let sentence = '';
        if (Number.isInteger(sentenceStart) && Number.isInteger(sentenceEnd)) {
            sentence = paragraph.slice(sentenceStart, sentenceEnd);
        }

        if (sentence && sentence.length > (answerText.length + 5)) {
            const patched = makeTextFragmentUriFromPassage(answerText, sentence, match.uri);
            if (patched) {
                match.uri = patched;
                continue;
            }
        }

        const patched = makeTextFragmentUriFromPassage(answerText, paragraph, match.uri);
        if (patched) {
            match.uri = patched;
        }
    }
}
