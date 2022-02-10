import get from 'lodash-es/get';
import { DocQAAnswer, ANSWER_RENDER_TEMPLATE, DOCQA_ANSWER_STATUS, QAPair } from './shared';


export function mangleAnswerByStatus(this: DocQAAnswer, qaPair: QAPair) {
    if (qaPair.STATUS === undefined || qaPair.STATUS === null) {
        return;
    }
    if (!qaPair.answer) {
        qaPair.answer = {};
    }

    switch (qaPair.STATUS) {

        case DOCQA_ANSWER_STATUS.ANSWERED: {
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_LINK;
            qaPair.answer.text = get(this.matches, '[0].text');
            qaPair.answer.uri = get(this.matches, '[0].uri');
            break;
        }

        case DOCQA_ANSWER_STATUS.NOT_ANSWERED: {
            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT;
            qaPair.answer.text = `I am sorry but I didn't find anything related.

            Could you rephrase it?
            Or maybe you can try to ask me something else?`;

            break;
        }

        case DOCQA_ANSWER_STATUS.NOT_CONFIDENT: {

            qaPair.useTemplate = ANSWER_RENDER_TEMPLATE.TEXT_WITH_MULTIPLE_LINKS;
            qaPair.answer.text = `I am not sure whether I can answer this. Anyhow, here are possible resources that might help:`;
            qaPair.answer.matches = this.matches.slice(0, 3).map((x) => {
                return {
                    text: x.text,
                    uri: x.uri,
                };
            });

            break;
        }

        default: {
            break;
        }
    }
}
