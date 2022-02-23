import { DocQAAnswer, QAPair } from './shared';

export function transformAnswerUriFixUri(this: DocQAAnswer, _qaPair: QAPair) {
    if (!this.matches.length) {
        return;
    }

    for (const match of this.matches) {
        let parsedUri;
        try {
            parsedUri = new URL(match.uri || '', window.location.href);
        } catch (err) {
            // Try to fix the uri.
            parsedUri = new URL(`${window.location.href}${match.uri}`);
            parsedUri.pathname = parsedUri.pathname.replace(/\/+/g, '/');
            match.uri = parsedUri.toString();
        }
    }
}
