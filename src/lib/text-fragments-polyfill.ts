import * as utils from './text-fragment-utils';

export function markAndScrollToTextFragment() {
    const hash = document.location.hash;
    const fragmentDirectives = utils.getFragmentDirectives(hash);
    const parsedFragmentDirectives = utils.parseFragmentDirectives(
        fragmentDirectives,
    );
    if (!parsedFragmentDirectives['text']) {
        return;
    }
    const processedFragmentDirectives = utils.processFragmentDirectives(
        parsedFragmentDirectives,
    );
    const createdMarks = processedFragmentDirectives['text'];

    window.addEventListener('hashchange', () => {
        // eslint-disable-next-line no-debugger
        utils.removeMarks(createdMarks.flat());
    }, { once: true });

    const firstFoundMatch = createdMarks.find((marks) => marks.length)?.[0];
    if (firstFoundMatch) {
        window.setTimeout(() => {
            firstFoundMatch.scrollIntoView({
                block: 'center',
                inline: 'nearest',
                behavior: 'smooth',
            });
        });
    }
}

let polyfillLive: boolean = false;
export function customTextFragmentsPolyfill() {
    if ('fragmentDirective' in document || 'fragmentDirective' in Location.prototype || polyfillLive) {
        return;
    }

    markAndScrollToTextFragment();

    window.addEventListener('hashchange', () => {
        // eslint-disable-next-line no-debugger
        markAndScrollToTextFragment();
    });

    polyfillLive = true;
}
