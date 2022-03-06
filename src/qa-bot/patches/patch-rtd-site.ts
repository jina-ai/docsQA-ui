import { isAbsoluteUrl } from '../../lib/url';
import type { QaBot } from '../qa-bot';

const metaKey = 'rtdSitePatched';

export default function patchRtdSite(this: QaBot) {
    if (!('READTHEDOCS_DATA' in window)) {
        return;
    }
    const rtdData = (window as any).READTHEDOCS_DATA;

    if (!rtdData) {
        return;
    }

    if (Reflect.hasOwnMetadata(metaKey, this)) {
        return;
    }

    const origFunc = this.makeReferenceLink;
    this.makeReferenceLink = function makeReferenceLink(input: string) {
        let uri = input;
        if (!isAbsoluteUrl(input)) {
            const url = new URL(`/${rtdData.language}/${rtdData.version}${input}`, window.location.href);
            url.pathname = url.pathname.replace(/\/*$/, '.html');
            uri = url.toString().replace(url.origin, '');
        }

        const r = origFunc.call(this, uri);

        return r;
    };
    Reflect.defineMetadata(metaKey, true, this);
}
