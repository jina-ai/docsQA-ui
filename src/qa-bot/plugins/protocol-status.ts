import get from 'lodash-es/get';
import { DocQAAnswer, ANSWER_RENDER_TEMPLATE, DOCQA_ANSWER_STATUS, QAPair } from './shared';
import { DEFAULT_PREFERENCE } from '../constants';


export function mangleAnswerByStatus(this: DocQAAnswer, qaPair: QAPair) {
    if (qaPair.STATUS === undefined || qaPair.STATUS === null) {
        return;
    }
    if (!qaPair.answer) {
        qaPair.answer = {};
    }

    switch (qaPair.STATUS) {

        case DOCQA_ANSWER_STATUS.UNKNOWN:
        case DOCQA_ANSWER_STATUS.ANSWERED: {
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK;
            const match = get(this.matches, '[0]');

            const paragraph: string = get(match, 'tags.paragraph');
            const sentenceStart = get(match, 'tags.sentence_start');
            const sentenceEnd = get(match, 'tags.sentence_end');
            const spanStart = get(match, 'tags.span_start');
            const spanEnd = get(match, 'tags.span_end');

            let answerText = match.text || '';
            if (Number.isInteger(spanStart) && Number.isInteger(spanEnd)) {
                answerText = paragraph.slice(spanStart, spanEnd);
            }

            let sentence = '';
            if (Number.isInteger(sentenceStart) && Number.isInteger(sentenceEnd)) {
                sentence = paragraph.slice(sentenceStart, sentenceEnd);
            }

            qaPair.answer.text = get(match, 'text');
            qaPair.answer.uri = get(match, 'uri');

            const splitVec = sentence.split(answerText);

            if (splitVec.length === 2) {
                const [a, b] = splitVec;
                qaPair.answer.tags = {
                    sentence,
                    answerVec: [a, answerText, b]
                };
            }

            break;
        }

        case DOCQA_ANSWER_STATUS.NOT_ANSWERED: {
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.UNKNOWN_ANSWER_TEXT;
            qaPair.answer.text = DEFAULT_PREFERENCE.unknownAnswer.text;

            break;
        }

        case DOCQA_ANSWER_STATUS.NOT_CONFIDENT: {

            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_MULTIPLE_LINKS;
            qaPair.answer.text = `😵‍💫 I'm not sure I can answer this. I guess these can help?`;
            qaPair.answer.matches = this.matches.slice(0, 3).map((x) => {
                return {
                    text: x.text,
                    uri: x.tags?.original_uri || x.uri,
                };
            });

            break;
        }

        default: {
            break;
        }
    }
}
