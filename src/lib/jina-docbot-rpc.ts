import { HTTPService } from './http-service';
import get from 'lodash-es/get';

export class JinaDocBotRPC extends HTTPService {

    constructor(serverUri: string) {
        super(serverUri);
    }


    async askQuestion(text: string) {

        const result = await this.postJson('/search', { data: [{ text }] });

        return get(result.data, 'data.docs[0].matches[0]') as { text: string, uri: string; };
    }

    sendFeedback(options: {
        question?: string;
        answer?: string;
        answer_uri?: string;
        thumbup?: boolean;
    }) {
        return this.postJson('/slack', options);
    }

}
