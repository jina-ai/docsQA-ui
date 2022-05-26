import get from 'lodash-es/get';
import { HTTPService } from './http-service';
import { DocumentArray, Document } from './jina-document-array';

export interface JinaServerEnvelope<T = DocumentArray> {
    data: T;
    header: {
        execEndpoint: string;
        requestId: string;
        status?: {
            code: number;
            description: string;
            exception?: {
                name: string;
                executor?: string;
                args?: string;
                stacks?: string[];
            };
        };
        targetExecutor: string;
    },
    parameters: unknown;
    routes: Array<{
        startTime: string;
        endTime: string;
        executor: string;
        status?: unknown;
    }>;
}

export enum DOCQA_ANSWER_STATUS {
    UNKNOWN = 0,
    ANSWERED = 1,
    NOT_CONFIDENT = 2,
    NOT_ANSWERED = 3,
}

export interface DocQAAnswer {
    STATUS: DOCQA_ANSWER_STATUS;
    matches: Document[];
    [k: string]: any;
}

export class UpstreamError extends Error {
    constructor(msg: string, public detail: any) {
        super(msg);
        Object.assign(this, detail);
        this.name = 'UpstreamError';
    }
}
export class JinaDocBotRPC extends HTTPService {

    constructor(serverUri: string, protected clientId: string) {
        super(serverUri);
    }

    async askQuestion(text: string) {
        const result = await this.postJson<
            JinaServerEnvelope<DocumentArray> &
            DocQAAnswer
        >('/search', { data: [{ text }], parameters: { client_id: this.clientId } });

        const status = get(result.data, 'header.status');

        if (status) {
            if (status.description) {
                throw new UpstreamError(status.description, status.exception);
            }
        }

        result.data = {
            ...result.data,
            STATUS: get(result.data, 'data[0].tags.STATUS', -1) as DOCQA_ANSWER_STATUS,
            answer: get(result.data, 'data[0].matches[0]') as Document,
            matches: get(result.data, 'data[0].matches') || [] as Document[],
            requestId: get(result.data, 'header.requestId')
        };

        return result;
    }

    sendFeedback(options: {
        requestId?: string;
        question?: string;
        answer?: string;
        answer_uri?: string;
        thumbup?: boolean | null;
    }) {
        return this.postJson('/slack', { data: [], parameters: { ...options, client_id: this.clientId } });
    }

    getStatus() {
        return this.get<{
            jina: { [k: string]: any; };
            envs: { [k: string]: any; };
            usedMemory: string;
        }>('/status');
    }

    getProject() {
        return this.getWithSearchParams('https://apidocsqa.jina.ai/projects', {
            metadata: true,
            host: this.baseURL.origin
        });
    }

}
