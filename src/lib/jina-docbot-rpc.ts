import { HTTPService } from './http-service';
import get from 'lodash-es/get';
import { DocumentArray, Document } from './jina-document-array';

export class JinaDocBotRPC extends HTTPService {

    constructor(serverUri: string) {
        super(serverUri);
    }

    async askQuestion(text: string) {

        const result = await this.postJson<DocumentArray>('/search', { data: [{ text }] });

        return get(result.data, 'data.docs[0].matches[0]') as Document;
    }

    sendFeedback(options: {
        question?: string;
        answer?: string;
        answer_uri?: string;
        thumbup?: boolean | null;
    }) {
        return this.postJson('/slack', options);
    }

}
