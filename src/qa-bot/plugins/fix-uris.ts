import { DocQAAnswer, QAPair } from './shared';

export function transformAnswerUriFixUri(this: DocQAAnswer, _qaPair: QAPair) {
    if (!this.matches.length) {
        return;
    }

    const origin = new URL('', window.location.href).origin;

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

        if (!match.tags) {
            match.tags = {};
        }
        match.tags.uri_same_origin = parsedUri.origin === origin;
    }
}
