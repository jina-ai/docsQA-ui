import { DOCQA_ANSWER_STATUS } from '../lib/jina-docbot-rpc';
import { Document as JinaDocument } from '../lib/jina-document-array';

export function getLocalStorageKey(channel: string = 'default', key: string = 'channel'): string {
    return `qabot:${key}:${channel}`;
}

export enum ANSWER_RENDER_TEMPLATE {
    TEXT = 'text',
    TEXT_WITH_LINK = 'text-with-link',
    TEXT_WITH_MULTIPLE_LINKS = 'text-with-multiple-links',
    PREFERENCE_TEXT = 'preference-text',
    ERROR = 'error',
    UNKNOWN_ANSWER_TEXT = 'unknown-answer-text'
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export interface QAPair {
    question?: string;
    answer?: DeepPartial<JinaDocument> & { [k: string]: any; };
    error?: Error | string;
    feedback?: boolean | null;
    requestId?: string;
    ts: number;
    TARGETED?: boolean;
    STATUS?: DOCQA_ANSWER_STATUS;
    useTemplate?: ANSWER_RENDER_TEMPLATE;
    [k: string]: any;
}
