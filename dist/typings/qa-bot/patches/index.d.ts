import type { QaBot } from '../qa-bot';
import dodgeRtdBadge from './dodge-rtd-badge';
export declare const DEFAULT_PATCHES: (typeof dodgeRtdBadge)[];
export declare type PatchFunction = (this: QaBot) => void;
export default DEFAULT_PATCHES;
