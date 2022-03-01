import { LitElement, html, PropertyValues } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import cloneDeep from 'lodash-es/cloneDeep';
import { perNextTick } from '../lib/decorators/per-tick';
import { throttle } from '../lib/decorators/throttle';
import { customTextFragmentsPolyfill } from '../lib/text-fragments-polyfill';
import customScrollbarCSS from '../shared/customized-scrollbar';
import { resetCSS } from '../shared/reset-css';
import { JinaQABotController } from './controller';
import { ANSWER_RENDER_TEMPLATE, getLocalStorageKey, QAPair } from './shared';
import masterStyle from './style';
import {
    paperPlane, downArrowCircle, defaultAvatar,
    thumbUp, thumbUpActive, thumbDown, thumbDownActive
} from './svg-icons';
import { AnswerRenderer, ANSWER_RENDERER_MAP } from './answer-renderers';
import { delay } from '../lib/timeout';
import { runOnce } from '../lib/decorators/once';
import { debounce } from '../lib/decorators/debounce';
import { DEFAULT_PREFERENCE } from './constants';
import { hslVecToCss, parseCssToHsl, rgbHexToHslVec } from '../lib/color';
import { xorDecryptB64EncodedUtf8, xorEncryptStringUtf8B64 } from '../lib/crypto';

const ABSPATHREGEXP = /^(https?:)?\/\/\S/;

/**
 * QABot custom element
 * @summary WebComponent for DocsQA
 *
 * @attr avatar-src - Customize chatbot avatar url
 * @attr header-background-src - Customize chatbot header background image with url
 * @attr animation-origin - Set the transform origin for the animation
 * @attr server - REQUIRED, specify the server url bot talks to.
 * @attr site - Specify site base location the links refer to, if not relative to current location.
 * @attr target - Specify <a target=""> of reference links.
 * @attr open - Set the chat-bot expanded or collapsed.
 * @attr theme - Choose between preset themes, auto, `light`, or `dark`.
 * @attr title - Title of the bot.
 * @attr description - Description of the bot.
 * @attr orientation - Orientation of the bot widget and animation.
 * @attr channel - Key for chat history storage.
 * @attr powered-by-icon-src - Image url for `powered-by` footer.
 */
export class QaBot extends LitElement {
    @property({ attribute: 'avatar-src', type: String, reflect: true })
    botAvatar?: string;

    @property({ type: String, reflect: true })
    override title!: string;

    @property({ type: String, reflect: true })
    description?: string;

    @property({ attribute: 'header-background-src', type: String, reflect: true })
    headerBackground?: string;

    @property({ attribute: 'orientation', type: String, reflect: true })
    orientation: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center' = 'bottom-right';

    @property({ type: String })
    token?: string;
    @property({ type: String })
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ type: String, reflect: true })
    target?: string = '_self';

    @property({ type: String })
    channel?: string;

    @property({ type: String, reflect: true })
    theme?: 'auto' | 'dark' | 'light' | 'infer' | string = 'infer';

    @property({ type: String, reflect: true, attribute: 'fg-color' })
    fgColor?: string;

    @property({ type: String, reflect: true, attribute: 'bg-color' })
    bgColor?: string;

    inferredThemeVariables = {
        'color-background': '',
        'color-border': '',
        'color-primary': '',
        'color-action': '',
        'color-action-secondary': '',
        'color-action-contrast': '',
        'color-action-contrast-secondary': '',
        'color-card-header-background': '',
        'color-card-header-color': '',
    };

    @property({ attribute: 'powered-by-icon-src', type: String, reflect: true })
    poweredByIconSrc?: string;

    @property({ type: Boolean, reflect: true })
    open?: boolean;

    @state()
    get busy() {
        return !(this.qaControl?.ready);
    }

    @state()
    protected typing: boolean = false;

    @state()
    protected closing: boolean = false;

    protected qaControl?: JinaQABotController;

    @query('.qabot__control textarea')
    protected textarea?: HTMLTextAreaElement;

    @query('.bottom-line-detector')
    protected bottomLineDetector?: HTMLElement;
    protected lastBottomLineDetector?: HTMLElement;

    protected bottomLineObserver: IntersectionObserver;
    protected themeMightChangeObserver: MutationObserver;

    scrolledToBottom?: boolean;
    smallViewPort?: boolean;

    @queryAssignedElements({ slot: 'name' })
    protected slotName?: Array<HTMLElement>;

    @queryAssignedElements({ slot: 'description' })
    protected slotDescription?: Array<HTMLElement>;

    @queryAssignedElements()
    protected slotDefault?: Array<HTMLElement>;

    @queryAssignedElements({ slot: 'greetings' })
    protected slotGreetings?: Array<HTMLElement>;

    @queryAssignedElements({ slot: 'texts' })
    protected slotTexts?: Array<HTMLElement>;

    preferences = cloneDeep(DEFAULT_PREFERENCE);

    debugEnabled?: boolean = false;

    private __debugEventListener?: (evt: CustomEvent) => void;

    answerRenderer: { [k in ANSWER_RENDER_TEMPLATE]: AnswerRenderer } = ANSWER_RENDERER_MAP;

    private __syncOptionsRoutine: (event: Event) => void;
    private __onScreenResizeRoutine: (event: Event) => void;
    private __inferThemeRoutine: (_: any) => void;

    constructor() {
        super();

        try {
            this.debugEnabled = Boolean(
                JSON.parse(localStorage.getItem(getLocalStorageKey(this.channel, 'debug')) || '')
            );
        } catch (err) {
            this.debugEnabled = false;
        }

        if (this.debugEnabled) {
            this.setupDebugEventListener();
        }

        this.bottomLineObserver = new IntersectionObserver((intersectionEvents) => {
            intersectionEvents.sort((a, b) => {
                return b.time - a.time;
            });
            const lastEvent = intersectionEvents[0];

            this.scrolledToBottom = lastEvent?.isIntersecting;
        });

        this.__inferThemeRoutine = async (_mutations) => {
            this.reInferTheme();
        };
        this.themeMightChangeObserver = new MutationObserver(this.__inferThemeRoutine);

        customTextFragmentsPolyfill();

        this.__syncOptionsRoutine = () => {
            this.loadPreferences();
            this.requestUpdate();
        };
        this.__onScreenResizeRoutine = () => {
            this.__detectViewPort();

            if (!this.scrolledToBottom) {
                return;
            }
            this.debouncedScrollToBottom();
        };
        this.__detectViewPort();

        this.loadPreferences();
    }

    protected __detectViewPort() {
        const fontSize = parseInt(window.getComputedStyle(this).fontSize, 10);
        const wrem = window.innerWidth / fontSize;
        const hrem = window.innerHeight / fontSize;
        const areaRem = wrem * hrem;
        let unitRemArea = 22.5 * hrem * 0.8;

        if (hrem > 90) {
            unitRemArea = 22.5 * fontSize * 72;
        }
        if (unitRemArea * 3 > areaRem) {
            this.smallViewPort = true;
        } else {
            this.smallViewPort = false;
        }
    }

    protected async __observeBottomLine() {
        const elem = this.bottomLineDetector;
        if (!elem) {
            return;
        }
        if (elem === this.lastBottomLineDetector) {
            return;
        }

        if (this.lastBottomLineDetector) {
            this.bottomLineObserver.unobserve(this.lastBottomLineDetector);
        }
        this.bottomLineObserver.observe(elem);
        this.lastBottomLineDetector = elem;
    }

    @debounce(100)
    protected debouncedScrollToBottom() {
        this.scrollDialogToBottom();
    }

    override connectedCallback() {
        document.addEventListener('readystatechange', this.__syncOptionsRoutine);
        window.addEventListener('resize', this.__onScreenResizeRoutine);
        super.connectedCallback();
        this.loadPreferences();
        this.__observeBottomLine();

        if (this.theme === 'infer') {
            this.__setUpThemeMightChangeObserver();
            this.inferTheme();
        }

        this.requestUpdate();
    }

    override disconnectedCallback() {
        document.removeEventListener('readystatechange', this.__syncOptionsRoutine);
        window.removeEventListener('resize', this.__onScreenResizeRoutine);
        super.disconnectedCallback();

        this.__suspendThemeMightChangeObserver();
        if (this.lastBottomLineDetector) {
            this.bottomLineObserver.unobserve(this.lastBottomLineDetector!);
            this.lastBottomLineDetector = undefined;
        }
    }

    static override styles = [
        resetCSS,
        customScrollbarCSS,
        masterStyle
    ];

    override update(changedProps: PropertyValues) {
        if (
            (changedProps.has('server') && this.server) ||
            (changedProps.has('token') && this.token)
        ) {
            if (this.server) {
                this.qaControl = new JinaQABotController(this, this.server, this.channel);
            } else {
                this.qaControl = new JinaQABotController(
                    this,
                    this.xorDecryptB64EncodedUtf8(this.token!),
                    this.channel
                );
            }

            this.loadPreferences();

            if (this.qaControl.qaPairs.length) {
                this.scrollDialogToBottom();
            }
        }
        if (changedProps.has('open')) {
            this.scrollDialogToBottomForTheVeryFirstTime();
        }
        if (changedProps.has('title')) {
            this.preferences.name = this.title;
        }
        if (
            (changedProps.has('fgColor') && this.fgColor) ||
            (changedProps.has('bgColor') && this.bgColor)
        ) {
            this.theme = 'infer';
            this.__setUpThemeMightChangeObserver();
            this.inferTheme();
        } else if (changedProps.has('theme')) {
            if (this.theme === 'infer') {
                this.__setUpThemeMightChangeObserver();
                this.inferTheme();
            } else {
                this.__suspendThemeMightChangeObserver();
            }
        }
        super.update(changedProps);
    }

    @runOnce()
    scrollDialogToBottomForTheVeryFirstTime() {
        return this.scrollDialogToBottom();
    }

    override updated() {
        if (!this.qaControl) {
            return;
        }
        this.__observeBottomLine();

        if (this.qaControl.qaPairToFocus) {
            this.scrollToAnswerByRequestId(this.qaControl.qaPairToFocus);
            this.__detectViewPort();
            if (!this.smallViewPort) {
                this.open = true;
            }
            this.qaControl.qaPairToFocus = undefined;
        }
    }

    protected onTextAreaInput(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }

        if (event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();

        this.submitQuestion();
    }

    setQaPairTargeted(qaPair?: QAPair) {
        if (!qaPair?.requestId) {
            return;
        }
        this.qaControl?.setTargeted(qaPair.requestId);
        if (this.smallViewPort && this.target === '_self') {
            this.closeCard();
        }
    }

    @throttle()
    async reInferTheme() {
        await delay(1);
        this.inferTheme();
        this.requestUpdate();
    }

    protected setupDebugEventListener(flag: boolean = true) {
        if (!this.__debugEventListener) {
            this.__debugEventListener = (event: CustomEvent) => {
                const detail = event.detail;

                if (detail.type === 'question-answered') {
                    console.log(detail);
                    return;
                }

                if (detail.type === 'error') {
                    console.error(detail.err);
                    return;
                }

            };
        }

        if (!flag) {
            this.removeEventListener('debug', this.__debugEventListener as any);

            return;
        }

        this.addEventListener('debug', this.__debugEventListener as any);
    }

    debugCommands(input: string) {
        const [cmd, ...args] = input.split(' ');
        switch (cmd) {
            case 'clear': {
                this.qaControl?.clear();
                break;
            }

            case 'debug': {
                if (args.length) {
                    // clear debug;
                    delete (window as any).qabotDebug;
                    this.debugEnabled = false;
                    localStorage.removeItem(getLocalStorageKey(this.channel, 'debug'));

                    this.setupDebugEventListener(false);

                    // eslint-disable-next-line no-console
                    console.info(`Debug disabled for qabot: ${this.channel || 'default'}`);

                    break;
                }

                const qabotDebug = {
                    this: this,
                    customTextFragmentsPolyfill,
                };
                (window as any).qabotDebug = qabotDebug;
                this.debugEnabled = true;
                localStorage.setItem(getLocalStorageKey(this.channel, 'debug'), JSON.stringify(this.debugEnabled));

                this.setupDebugEventListener();
                // eslint-disable-next-line no-console
                console.info(`Debug enabled for qabot: ${this.channel || 'default'}`);

                break;
            }

            case 'highlight': {
                if (!args.length) {
                    break;
                }
                if (location.hash.includes(':~:')) {
                    location.hash = location.hash.replace(/:~:text=.*$/, `:~:text=${args.join(' ')}`);
                    break;
                }
                location.hash += `:~:text=${args.join(' ')}`;
                break;
            }

            case 'close': {
                this.open = false;

                break;
            }

            case 'project': {
                this.qaControl?.getProject(...args).finally(() => {
                    this.scrollDialogToBottom();
                });
                break;
            }
            case 'version': {
                this.qaControl?.getProject('version').finally(() => {
                    this.scrollDialogToBottom();
                });
                break;
            }
            case 'status': {
                this.qaControl?.getStatus(...args).finally(() => {
                    this.scrollDialogToBottom();
                });
                break;
            }

            default: {
                break;
            }
        }

        this.textarea!.value = '';
    }

    @throttle()
    async submitQuestion() {
        if (!this.qaControl) {
            return;
        }
        const questionInput = this.textarea?.value;
        if (!questionInput) {
            return;
        }

        if (questionInput.startsWith(':')) {
            this.debugCommands(questionInput.slice(1));

            return;
        }

        const rPromise = this.qaControl.askQuestion(questionInput);

        this.scrollDialogToBottom();

        try {
            const qaPair = await rPromise;
            this.qaControl.sendFeedback(
                qaPair,
                'none',
                qaPair.answer?.uri ?
                    new URL(this.makeReferenceLink(qaPair.answer.uri), window.location.href).toString() : undefined
            ).catch(() => 'swallow');
            this.textarea!.value = '';
            this.textarea!.setAttribute('style', `height: auto;`);

        } finally {
            await this.scrollDialogToBottom();
        }

        await this.updateComplete;
        if (this.open && !this.smallViewPort) {
            this.textarea?.focus();
        }
    }

    @throttle()
    protected async submitFeedback(qaPair: QAPair, feedback: 'up' | 'down' | 'none' = 'none') {
        if (!this.qaControl) {
            return;
        }

        const r = await this.qaControl?.sendBlockingFeedback(
            qaPair,
            feedback,
            qaPair.answer?.uri ?
                new URL(this.makeReferenceLink(qaPair.answer.uri), window.location.href).toString() : undefined
        );

        await this.scrollDialogToBottom();

        return r;
    }

    @perNextTick()
    @throttle()
    async scrollDialogToBottom() {
        await this.updateComplete;
        const elem = this.renderRoot?.querySelector('.qabot__answer-block');

        if (!elem) {
            return;
        }

        elem.scroll({
            top: elem.scrollHeight,
            left: 0,
            behavior: this.open ? 'smooth' : 'auto'
        });
    }

    @perNextTick()
    @throttle()
    async scrollToAnswerByRequestId(requestId: string) {
        if (!this.qaControl) {
            return;
        }

        await this.updateComplete;

        let targetIdx = -1;

        for (const [index, qaPair] of this.qaControl.qaPairs.entries()) {
            if (!qaPair.requestId) {
                continue;
            }
            if (qaPair.requestId === requestId) {
                targetIdx = index;
                break;
            }
        }

        if (targetIdx === -1) {
            return this.scrollDialogToBottom();
        }

        const elem = this.renderRoot?.querySelector(`.answer-dialog > .qa-pair:nth-child(${targetIdx + 1})`);

        if (!elem) {
            return this.scrollDialogToBottom();
        }

        elem.scrollIntoView({
            block: 'start',
            behavior: this.open ? 'smooth' : 'auto'
        });
    }

    @throttle()
    async toggleOpen() {
        if (this.open) {
            this.closeCard();
        } else {
            this.openCard();
            this.textarea?.focus();
        }
    }

    @throttle()
    async closeCard() {
        this.closing = !!this.open;
        if (this.open) {
            await delay(300);
            this.open = false;
        }
    }

    openCard() {
        this.closing = false;
        this.open = true;
    }

    protected makeReferenceLink(uri?: string) {
        if (!uri) {
            return '#';
        }

        if (ABSPATHREGEXP.test(uri)) {
            return uri;
        }

        if (this.site) {
            const fixedLink = `/${uri}`.replace(/^\/+/, '/');
            if (ABSPATHREGEXP.test(this.site)) {
                return `${this.site}${fixedLink}`;
            }

            if (this.site.startsWith('/')) {
                return `${this.site}${uri}`.replace(/^\/+/, '/');
            }

            return `//${this.site}${fixedLink}`;
        }

        return uri;
    }

    protected getSingleQAComp(qa: QAPair, index: number) {
        // the last graph means current qa is last one, or there is a new question is risen.
        const isLastGraph: boolean = !this.qaControl?.qaPairs[index + 1] ||
            !!this.qaControl?.qaPairs[index + 1]?.question;

        return html`
            <div class="qa-pair" ?multi-convo="${!qa.question}" ?last-graph="${isLastGraph}">
                ${qa.question ? html`
                <div class="qa-row question">
                    <div class="bubble">
                        <div class="talktext">
                            <p>${qa.question}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
                <div class="qa-row answer">
                    <div class="avatar">${isLastGraph ? this.getAvatar() : ''}</div>
                    <div class="bubble">
                        ${this.renderAnswerBubble(qa)}
                    </div>
                    <div class="feedback-tooltip">
                        ${this.getFeedbackTooltip(qa)}
                    </div>
                </div>
            </div>
    `;
    }

    protected getFeedbackTooltip(qa: QAPair) {
        return html`
        ${(qa.question && qa.answer) ? html`
        <div class="thumbs">
            <button class="thumb thumbup" ?active="${qa.feedback === true}" ?disabled="${qa.feedback !== undefined}"
                @click="${() => this.submitFeedback(qa, 'up')}">
                <i class="icon icon-thumb-up">${qa.feedback === true ? thumbUpActive : thumbUp}</i>
            </button>
            <button class="thumb thumbdown" ?active="${qa.feedback === false}" ?disabled="${qa.feedback !== undefined}"
                @click="${() => this.submitFeedback(qa, 'down')}">
                <i class="icon icon-thumb-down">${qa.feedback === false ? thumbDownActive : thumbDown}</i>
            </button>
        </div>
        ` : ''}
        `;
    }
    protected renderAnswerBubble(qaPair: QAPair) {
        if (!qaPair.answer && !qaPair.error) {
            return html`
                <div class="talktext">
                    <div class="icon loading triple-dot">${[1, 2, 3].map(() => html`<span class="dot"></span>`)}</div>
                </div>`;
        }

        const renderer = this.answerRenderer[qaPair.useTemplate!] || this.answerRenderer.text;

        return renderer.call(this, qaPair);
    }

    __loadFromSlot(elems?: HTMLElement[], selector = '*') {
        if (!elems?.length) {
            return;
        }
        for (const elem of elems) {
            const root = elem.tagName === 'TEMPLATE' ? (elem as HTMLTemplateElement).content : elem;

            const children = root.querySelectorAll(selector) as NodeListOf<HTMLElement>;

            const tgt = children.length === 1 ? children[0] : (root as HTMLElement);

            if (!tgt.textContent) {
                continue;
            }

            return tgt;
        }
    }

    loadPreferences() {

        if (this.title) {
            this.preferences.name = this.title;
        }
        if (this.slotName?.length) {
            const elem = this.__loadFromSlot(this.slotName);
            const text = elem?.textContent?.trim();
            if (text) {
                this.preferences.name = text;
            }
        }

        if (this.description !== undefined) {
            this.preferences.description = this.description;
        }
        if (this.slotDescription?.length) {
            const elem = this.__loadFromSlot(this.slotDescription);
            const text = elem?.textContent?.trim();
            if (text) {
                this.preferences.description = text;
            }
        }
        if (this.slotGreetings?.length || this.slotDefault?.length) {
            const elem = this.__loadFromSlot(this.slotGreetings, 'dl') || this.__loadFromSlot(this.slotDefault, 'dl');
            const dt = elem?.querySelector('dt');
            const dds = elem?.querySelectorAll('dd');

            if (dt?.textContent) {
                this.preferences.greeting = dt.textContent.trim();
            }

            if (dds?.length) {
                this.preferences.questions = Array.from(dds)
                    .filter((x) => Boolean(x.textContent?.trim()))
                    .map((x) => x.textContent!.trim());
            }
        }

        if (this.slotTexts?.length) {
            const elem = this.__loadFromSlot(this.slotTexts);
            const inputElems = elem?.querySelectorAll('[for]') as (NodeListOf<HTMLElement> | undefined);
            if (inputElems?.length) {
                for (const elem of Array.from(inputElems)) {
                    const key = elem.getAttribute('for');
                    if (!key) {
                        continue;
                    }
                    if (elem.tagName === 'UL' || elem.tagName === 'DL' || elem.tagName === 'OL') {
                        const arrayElems = elem.querySelectorAll('li,dd');
                        (this.preferences.texts as any)[key] = Array.from(arrayElems).map((e) => e.textContent);
                        continue;
                    }
                    if (!elem.textContent) {
                        continue;
                    }
                    (this.preferences.texts as any)[key] = elem.textContent;
                }
            } else if (elem?.getAttribute('for')) {
                const key = elem.getAttribute('for')!;
                if (elem.tagName === 'UL' || elem.tagName === 'DL' || elem.tagName === 'OL') {
                    const arrayElems = elem.querySelectorAll('li,dd');
                    (this.preferences.texts as any)[key] = Array.from(arrayElems).map((e) => e.textContent);
                } else if (elem.textContent) {
                    (this.preferences.texts as any)[key] = elem.textContent;
                }
            }
        }
    }

    protected inferTheme() {
        let fgHsl: [number, number, number] | undefined;
        let bgHsl: [number, number, number] | undefined;

        if (this.fgColor) {
            fgHsl = parseCssToHsl.call(this, this.fgColor);
        }
        if (this.bgColor) {
            bgHsl = parseCssToHsl.call(this, this.bgColor);
        }

        if (!bgHsl || bgHsl.reduce((x, a) => x + a) >= 255 * 3) {
            const cssVariablesToCheck = [
                '--color-background-primary',
                '--md-default-bg-color',
            ];
            for (const cssVar of cssVariablesToCheck) {
                bgHsl = parseCssToHsl.call(this, cssVar);

                if (bgHsl) {
                    break;
                }
            }
        }

        if (!bgHsl) {
            let ptr = this.parentElement;
            const body = document.body;

            while (ptr && ptr !== body) {
                const bgCss = window.getComputedStyle(ptr).backgroundColor.replace(/\s/g, '');

                if (bgCss !== 'rgba(0,0,0,0)') {
                    bgHsl = parseCssToHsl.call(this, bgCss);
                    break;
                }

                ptr = ptr.parentElement;
            }
        }

        if (!bgHsl) {
            const bgCss = window.getComputedStyle(document.body).backgroundColor.replace(/\s/g, '');

            if (bgCss !== 'rgb(255,255,255)' && bgCss !== 'rgba(0,0,0,0)') {
                bgHsl = parseCssToHsl.call(this, bgCss);
            }
        }

        if (!bgHsl) {
            bgHsl = rgbHexToHslVec('#fff')!;
        }

        let mode: 'light' | 'dark' = 'light';
        if (bgHsl[2] <= 50) {
            mode = 'dark';
        }

        if (!fgHsl && this.style.color) {
            const fgCss = this.style.color;

            fgHsl = parseCssToHsl.call(this, fgCss);
        }

        if (!fgHsl) {
            const cssVariablesToCheck = [
                '--color-brand-primary',
                '--md-primary-fg-color',
            ];
            for (const cssVar of cssVariablesToCheck) {
                fgHsl = parseCssToHsl.call(this, cssVar);

                if (fgHsl) {
                    break;
                }
            }
        }

        if (!fgHsl) {
            const fgCss = window.getComputedStyle(this).color.replace(/\s/g, '');

            if (fgCss !== 'rgb(0,0,0)') {
                fgHsl = parseCssToHsl.call(this, fgCss);
            }
            if (fgHsl) {
                if (Math.abs(fgHsl[2] - bgHsl[2]) < 20) {
                    fgHsl = undefined;
                }
            }
        }

        if (!fgHsl) {
            const headerElem = document.querySelector('header,nav');
            if (headerElem) {
                const fgCss = window.getComputedStyle(headerElem).backgroundColor.replace(/\s/g, '');
                if (fgCss !== 'rgba(0,0,0,0)') {
                    fgHsl = parseCssToHsl.call(this, fgCss);
                }
            }
            if (fgHsl) {
                if (Math.abs(fgHsl[2] - bgHsl[2]) < 20) {
                    fgHsl = undefined;
                }
            }
        }

        const tgt: Partial<this['inferredThemeVariables']> = {};
        if (mode === 'light') {
            if (!fgHsl) {
                fgHsl = rgbHexToHslVec('#009191')!;
            }
            tgt['color-background'] = hslVecToCss(bgHsl);
            tgt['color-action'] = hslVecToCss(fgHsl);
            tgt['color-primary'] = bgHsl[2] > 60 ? '#000' : '#fff';
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            tgt['color-action-secondary'] = hslVecToCss(fgHsl, 0.05);
            // tgt['color-border'] = hslVecToCss(fgHsl);
            tgt['color-action-contrast'] = fgHsl[2] > 60 ? '#000' : '#fff';
            tgt['color-action-contrast-secondary'] = hslVecToCss(bgHsl, 0.87);
            tgt['color-card-header-background'] = hslVecToCss(fgHsl);
            tgt['color-card-header-color'] = fgHsl[2] > 60 ? '#000' : '#fff';

        } else if (mode === 'dark') {
            if (!fgHsl) {
                fgHsl = rgbHexToHslVec('#FBCB67')!;
            }
            tgt['color-background'] = hslVecToCss(bgHsl);
            tgt['color-action'] = hslVecToCss(fgHsl);
            tgt['color-primary'] = bgHsl[2] > 50 ? '#000' : '#fff';
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            tgt['color-action-secondary'] = hslVecToCss(fgHsl, 0.05);
            // tgt['color-border'] = hslVecToCss(fgHsl);
            tgt['color-action-contrast'] = fgHsl[2] > 50 ? '#000' : '#fff';
            tgt['color-action-contrast-secondary'] = hslVecToCss(bgHsl, 0.87);
            tgt['color-card-header-background'] = '#ffffff1a';
            tgt['color-card-header-color'] = '#fff';
        }
        this.inferredThemeVariables = tgt as any;

        return [fgHsl, bgHsl, mode, this.inferredThemeVariables];
    }
    private __setUpThemeMightChangeObserver() {
        this.themeMightChangeObserver.observe(this, { attributes: true, attributeFilter: ['style'] });
        this.themeMightChangeObserver.observe(document.body, { attributes: true });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.__inferThemeRoutine);
    }
    private __suspendThemeMightChangeObserver() {
        this.themeMightChangeObserver.disconnect();
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.__inferThemeRoutine);
    }

    protected xorDecryptB64EncodedUtf8 = xorDecryptB64EncodedUtf8;
    protected xorEncryptStringUtf8B64 = xorEncryptStringUtf8B64;

    protected getAnswerBlock() {

        return html`
        <div class="answer-hint" tabindex="0">
            <div class="avatar">${this.getAvatar()}</div>
            <dl class="answer-hint__content">
                <dt class="greeting">${this.preferences.greeting}</dt>
                ${this.preferences.questions.map((item, index) => html`<dd class="question"><button key="${index}"
                        @click="${this.onClickQuestion}">${item}</button></dd>`)}
            </dl>
        </div>
        <div class="answer-dialog">
            ${this.qaControl?.qaPairs.map((qa, index) => this.getSingleQAComp(qa, index))}
            <i class="bottom-line-detector"></i>
        </div>
        `;
    }

    protected onClickQuestion(e: Event) {
        const text = (e.target as HTMLElement).innerText;
        this.textarea!.value = text.trim();
        this.submitQuestion();
    }

    protected getAvatar() {
        if (this.botAvatar) {
            return html`
            <img src="${this.botAvatar}" alt="avatar" />
            `;
        }
        return defaultAvatar;
    }

    protected onInputQuestion() {
        const content = this.textarea?.value;
        this.typing = !!content;
        // The following line prevents the height pile up. Need to keep.
        this.textarea?.setAttribute('style', `height: auto;`);
        this.textarea?.setAttribute('style', `height: ${(this.textarea?.scrollHeight + 1).toString()}px`);
    }

    override render() {
        const inferredThemeVariables = Object.entries(this.inferredThemeVariables)
            .filter(([_k, v]) => Boolean(v))
            .map(([k, v]) => {
                return `--qabot-${k}: ${v};`;
            });

        return html`
        <style>
            .card .card__header {
                background-image: ${this.headerBackground ? `url(${this.headerBackground})` : 'unset'};
            }

            :host([theme='infer']){
                ${unsafeHTML(inferredThemeVariables.join('\n'))};
            }
            </style>
        <div class="slots" style="display: none">
            <slot name="name"></slot>
            <slot name="description"></slot>
            <slot name="texts"></slot>
            <slot name="greetings"></slot>
            <slot></slot>
        </div>
        <button ?visible="${!this.open}" title="${this.preferences.name}" class="qabot widget"
            @click="${this.toggleOpen}">${this.getAvatar()}</button>
        <div class="qabot card" title="" ?busy="${this.busy}" ?visible="${this.open}" ?closing="${this.closing}">
            <button class="card__header" @click="${this.toggleOpen}">
                <span class="card__title">
                    <div class="icon avatar">${this.getAvatar()}</div>
                    <span class="card__title__content">
                        <span class="name">${this.preferences.name}</span>
                        <span class="description">${this.preferences.description}</span>
                    </span>
                </span>
                <i class="icon arrow-down">${downArrowCircle}</i>
            </button>
            <div class="card__content" title="">
                <div class="qabot__answer-block" title="">
                    ${this.getAnswerBlock()}
                </div>
                <div class="qabot__control">
                    <textarea maxlength="200" rows="1" tabindex="0" ?disabled="${this.busy}"
                        @keydown="${this.onTextAreaInput}"
                        @input="${this.onInputQuestion}"
                        placeholder="${this.server ? 'Type your question here...' : 'Waiting for server configuration...'}"></textarea>
                    <button title="Submit" ?disabled="${this.busy}" ?active="${this.typing}" @click="${this.submitQuestion}">
                        <i class="icon icon-plane">${paperPlane}</i>
                    </button>
                    ${this.poweredByIconSrc ? html`<div class="powered-by"><i class="icon"><img src="${this.poweredByIconSrc}"
                                alt="powered-by" class="powered-by-img" /></i></div>` : ''}
                </div>
            </div>
        </div>
        `;
    }
}
