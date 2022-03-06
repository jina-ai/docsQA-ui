import type { QaBot } from '../qa-bot';
import dodgeRtdBadge from './dodge-rtd-badge';
import patchRtdSite from './patch-rtd-site';

export const DEFAULT_PATCHES = [
    dodgeRtdBadge,
    patchRtdSite
];

export type PatchFunction = (this: QaBot) => void;

export default DEFAULT_PATCHES;
