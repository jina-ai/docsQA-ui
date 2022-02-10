import get from 'lodash-es/get';
import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';

export interface JinaServerEnvelope<T = any> {
    data: {
        docs: T;
        groundtruths: unknown[];
    };
    requestId: string;
}

export enum DOCQA_ANSWER_STATUS {
    UNKNOWN = -1,
    ANSWERED = 0,
    NOT_CONFIDENT = 1,
    NOT_ANSWERED = 2,
}

export interface DocQAAnswer {
    STATUS: DOCQA_ANSWER_STATUS;
    matches: Document[];
    [k: string]: any;
}

export class JinaDocBotRPC extends HTTPService {

    constructor(serverUri: string) {
        super(serverUri);
    }

    async askQuestion(text: string) {
        const result = await this.postJson<
            JinaServerEnvelope<DocumentArray> &
            DocQAAnswer
        >('/search', { data: [{ text }] });

        result.data = {
            ...result.data,
            STATUS: get(result.data, 'data.docs[0].tags.STATUS') || -1 as DOCQA_ANSWER_STATUS,
            answer: get(result.data, 'data.docs[0].matches[0]') as Document,
            matches: get(result.data, 'data.docs[0].matches') as Document[]
        };
        return result;
    }

    sendFeedback(options: {
        question?: string;
        answer?: string;
        answer_uri?: string;
        thumbup?: boolean | null;
    }) {
        return this.postJson('/slack', { data: [], parameters: options });
    }

}
