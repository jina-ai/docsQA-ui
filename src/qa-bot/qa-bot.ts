import { LitElement, html, PropertyValues } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
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
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ type: String, reflect: true })
    target?: string = '_self';

    @property({ type: String })
    channel?: string;

    @property({ type: String, reflect: true })
    theme?: 'auto' | 'dark' | 'light' | string = 'auto';

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

    scrolledToBottom?: boolean;
    smallViewPort?: boolean;
    expectPhysicalKeyboard?: boolean = false;

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

    private lastKeyDownAt?: number;
    private lastKeyDown?: string;

    preferences = {
        name: 'DocsQA',
        description: '@Jina AI',
        greeting: 'You should define custom questions inside <qa-bot>. Try:',
        questions: [
            'Create a <dl> block',
            'Set title using <dt>',
            'Set questions using <dd>'
        ],
        texts: {
            feedbackThumbUp: `Thank you for providing your feedback, happy to help! 😀`,
            feedbackThumbDown: `Thank you for providing your feedback, we will continue to improve. 🙇‍♂️`,
            contextHref: 'See context',
            unknownError: `🚨 Sorry, something went wrong. ⛑️\nPlease try again later.`,
            networkError: `🚨 Sorry, we are experiencing some technical difficulties on networking. 🌐\nPlease try again later. 🙇‍♂️`,
            serverError: `🚨 Sorry, we are experiencing some technical difficulties on the server. 🐛\nPlease try again later. 🙇‍♂️`,
        }
    };

    debugEnabled?: boolean = false;

    private __debugEventListener?: (evt: CustomEvent) => void;

    answerRenderer: { [k in ANSWER_RENDER_TEMPLATE]: AnswerRenderer } = ANSWER_RENDERER_MAP;

    private __syncOptionsRoutine: (event: Event) => void;
    private __onScreenResizeRoutine: (event: Event) => void;

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
        this.requestUpdate();
    }

    override disconnectedCallback() {
        document.removeEventListener('readystatechange', this.__syncOptionsRoutine);
        window.removeEventListener('resize', this.__onScreenResizeRoutine);
        super.disconnectedCallback();

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
        if (changedProps.has('server') && this.server) {
            this.qaControl = new JinaQABotController(this, this.server, this.channel);

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
            if (!this.smallViewPort) {
                this.open = true;
            }
            this.qaControl.qaPairToFocus = undefined;
        }
    }

    protected onTextAreaInput(event: KeyboardEvent) {
        if (this.lastKeyDown !== event.key) {
            this.lastKeyDown = event.key;
            this.lastKeyDownAt = performance.now();
        }
        if (event.key !== 'Enter') {
            return;
        }

        if (event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();

        this.submitQuestion();
    }

    protected onTextAreaKeyUp(event: KeyboardEvent) {
        if (event.key !== this.lastKeyDown) {
            return;
        }

        if (!this.lastKeyDownAt) {
            return;
        }

        if ((performance.now() - this.lastKeyDownAt) > 20) {
            this.expectPhysicalKeyboard = true;
        } else {
            this.expectPhysicalKeyboard = false;
        }
    }

    setQaPairTargeted(qaPair?: QAPair) {
        if (!qaPair?.requestId) {
            return;
        }
        this.qaControl?.setTargeted(qaPair.requestId);
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

        } finally {
            await this.scrollDialogToBottom();
        }

        await this.updateComplete;
        if (this.open && this.expectPhysicalKeyboard) {
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
        this.closing = !!this.open;
        if (this.open) {
            await delay(300);
            this.open = false;
        } else {
            this.open = true;
            this.textarea?.focus();
        }
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
            <button class="thumb thumbup" ?active="${qa.feedback === true}" @click="${() => this.submitFeedback(qa, 'up')}">
                <i class="icon icon-thumb-up">${qa.feedback === true ? thumbUpActive : thumbUp}</i>
            </button>
            <button class="thumb thumbdown" ?active="${qa.feedback === false}"
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
            const textElems = elem?.querySelectorAll('[for]') as (NodeListOf<HTMLElement> | undefined);
            if (textElems?.length) {
                for (const elem of Array.from(textElems)) {
                    const key = elem.getAttribute('for');
                    if (!key) {
                        continue;
                    }
                    if (!elem.textContent) {
                        continue;
                    }
                    (this.preferences.texts as any)[key] = elem.textContent;
                }
            } else if (elem?.getAttribute('for')) {
                const key = elem.getAttribute('for')!;
                if (elem.textContent) {
                    (this.preferences.texts as any)[key] = elem.textContent;
                }
            }
        }
    }

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
        return html`
        <style>
            .card .card__header {
                background-image: ${this.headerBackground ? `url(${this.headerBackground})` : 'unset'};
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
                        @keyup="${this.onTextAreaKeyUp}"
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
