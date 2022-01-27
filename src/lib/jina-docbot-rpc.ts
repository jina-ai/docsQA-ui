import get from 'lodash-es/get';
import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';


export interface JinaServerEnvelope<T = any> {
    data: {
        docs: T;
    };
    requestId: string;
}

export class JinaDocBotRPC extends HTTPService {

    constructor(serverUri: string) {
        super(serverUri);
    }

    async askQuestion(text: string) {
        const result = await this.postJson<
            JinaServerEnvelope<DocumentArray> &
            { [k: string]: any; }
        >('/search', { data: [{ text }] });

        result.data = { ...result.data, answer: get(result.data, 'data.docs[0].matches[0]') as Document };
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
