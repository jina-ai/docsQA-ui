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

    const traditionalHash = hash.split(':~:')[0];
    const elemId = traditionalHash?.substring(1);
    const elem = elemId ? document.querySelector(`#${elemId}`) : null;
    const scrollParam: any = {
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
    };
    const firstFoundMatch = createdMarks.find((marks) => marks.length)?.[0];
    if (firstFoundMatch && elem && elem.contains(firstFoundMatch)) {
        window.setTimeout(() => {
            firstFoundMatch.scrollIntoView(scrollParam);
        });
    } else if (elem) {
        window.setTimeout(() => {
            elem.scrollIntoView(scrollParam);
        });
    } else if (firstFoundMatch) {
        window.setTimeout(() => {
            firstFoundMatch.scrollIntoView(scrollParam);
        });
    }
}

let polyfillLive: boolean = false;
export function customTextFragmentsPolyfill() {
    if (('fragmentDirective' in document) || ('fragmentDirective' in Location.prototype) || polyfillLive) {
        return;
    }

    markAndScrollToTextFragment();

    window.addEventListener('hashchange', () => {
        markAndScrollToTextFragment();
    });

    document.addEventListener('readystatechange', () => {
        if (document.readyState !== 'complete') {
            return;
        }
        window.setTimeout(markAndScrollToTextFragment);
    });

    polyfillLive = true;
}
