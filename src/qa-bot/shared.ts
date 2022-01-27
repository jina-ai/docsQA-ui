export function getLocalStorageKey(channel: string = 'default', key: string = 'channel'): string {
    return `qabot:${key}:${channel}`;
}

function patchTextFragmentEncoding(text: string) {
    return encodeURIComponent(text).replace(/-/g, '%2D');
}

export function makeTextFragmentUriFromPassage(text: string, paragraph: string, uri: string) {
    const [prefix, suffix] = paragraph.split(text);

    const prefixFragment = prefix.match(/\b\w.{0,15}$/)?.[0].trim();
    const suffixFragment = (suffix || '').trim().match(/^\S.{0,14}\b/)?.[0].trim();

    const fragment = `:~:text=${prefixFragment ? `${patchTextFragmentEncoding(prefixFragment)}-,` : ''}${patchTextFragmentEncoding(text)}${suffixFragment ? `,-${patchTextFragmentEncoding(suffixFragment)}` : ''}`;

    const parsedUri = new URL(uri, window.location.href);
    if (!parsedUri.hash) {
        return `${uri}#${fragment}`;
    }

    if (uri.endsWith('#')) {
        return `${uri}${fragment}`;
    }

    return `${uri}${fragment}`;
}
