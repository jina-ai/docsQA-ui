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
import { paperPlane, downArrowCycle, defaultAvatar,
    thumbUp, thumbUpActive, thumbDown, thumbDownActive } from './svg-icons';
import { AnswerRenderer, ANSWER_RENDERER_MAP } from './answer-renderers';

const ABSPATHREGEXP = /^(https?:)?\/\/\S/;

/**
 * QABot custom element
 * @summary WebComponent for DocsQA
 *
 * @attr botAvatar - Customize chatbot avatar
 * @attr headerBackground - Customize chatbot header background image with url
 * @attr animation-origin - Set the transform origin for the animation
 * @attr server - REQUIRED, specify the server url bot talks to.
 * @attr site - Specify site base location the links refer to, if not relative to current location.
 * @attr target - Specify <a target=""> of reference links.
 * @attr open - Set the chat-bot expanded or collapsed.
 * @attr theme - Choose between preset themes, auto, `light`, or `dark`.
 */
export class QaBot extends LitElement {
    @property({ attribute: 'bot-avatar', type: String, reflect: true })
    botAvatar?: string;

    @property({ attribute: 'header-background', type: String, reflect: true })
    headerBackground?: string;

    @property({ attribute: 'animation-origin', type: String, reflect: true })
    animationOrigin?: string = 'left-bottom';

    @property({ type: String })
    server?: string;

    @property({ type: String })
    site?: string;

    @property({ attribute: 'link-to-text-fragment', type: String, reflect: true })
    linkToTextFragment?: 'none';

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

    @queryAssignedElements({ slot: 'name' })
    protected botName?: Array<HTMLElement>;

    @queryAssignedElements({ slot: 'description' })
    protected botDescription?: Array<HTMLElement>;

    @queryAssignedElements({ slot: 'hint' })
    protected hint?: Array<HTMLElement>;

    @state()
    private __greeting = this.hint?.[0]?.innerHTML;
    // private __questions = this.hint?.[0]?.querySelectorAll('dd').map((item HTMLElement) => item.innerText);

    private __defaultInfo = {
        name: 'DocsQA',
        description: '@Jina AI',
        greeting: 'You can ask questions about Jina. Try:',
        questions: [
                'What is Jina?',
                'Does Jina support Kubernetes?',
                'How can I traverse a nested DocumentArray?'
        ]
    };

    debugEnabled?: boolean = false;

    private __debugEventListener?: (evt: CustomEvent) => void;

    answerRenderer: { [k in ANSWER_RENDER_TEMPLATE]: AnswerRenderer } = ANSWER_RENDERER_MAP;

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

        customTextFragmentsPolyfill();
        if (document.readyState !== 'complete') {
            document.addEventListener('DOMContentLoaded', () => {
                this.requestUpdate();
            }, { once: true });
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

            if (this.qaControl.qaPairs.length) {
                this.scrollDialogToBottom();
            }
        }
        super.update(changedProps);
    }

    override updated() {
        if (!this.qaControl) {
            return;
        }

        if (this.qaControl.qaPairToFocus) {
            this.scrollToAnswerByRequestId(this.qaControl.qaPairToFocus);
            this.open = true;
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
        if (this.open) {
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

    toggleOpen() {
        this.closing = !!this.open;
        if (this.open) {
            setTimeout(() => {
                this.open = false;
                this.textarea?.focus();
            }, 300);
        } else {
            this.open = true;
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

    protected getSingleQAComp(qa: QAPair) {
        return html`
            <div class="qa-pair">
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
                    <div class="avatar">${this.getAvatar()}</div>
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
        if (qaPair.error) {
            return html`
            <div class="talktext">
                <p>${qaPair.error.toString()}</p>
            </div>
            <div class="feedback-tooltip">
                <a class="answer-reference" href="https://slack.jina.ai" target="_blank">Report</a>
            </div>`;
        }

        if (!qaPair.answer) {
            return html`
                <div class="talktext"><div class="icon loading triple-dot">${[1, 2, 3].map(() => html`<span class="dot"></span>`)}</div></div>`;
        }

        const renderer = this.answerRenderer[qaPair.useTemplate!] || this.answerRenderer.text;

        return renderer.call(this, qaPair);
    }

    protected getAnswerBlock() {
        const greeting = this.hint?.[0]?.querySelector('dt')?.innerText;
        const questions: Array<string> = [];
        this.hint?.[0]?.querySelectorAll('dd')?.forEach((item) => {
            questions.push(item.innerText);
        });
        return html`
        <div class="answer-hint" tabindex="0">
            <div class="avatar">${this.getAvatar()}</div>
            <dl class="answer-hint__content">
                <dt class="greeting">${greeting || this.__defaultInfo.greeting}</dt>
                ${(questions.length > 0 ? questions : this.__defaultInfo.questions).map((item, index) => html`<dd class="question"><button key="${index}" @click="${this.onClickQuestion}">${item}</button></dd>`)}
            </dl>
        </div>
         <div class="answer-dialog">
            ${this.qaControl?.qaPairs.map((qa) => this.getSingleQAComp(qa))}
        </div>
        `;
    }

    protected onClickQuestion(e: Event) {
        const text = (e.target as HTMLElement).innerText;
        this.textarea!.value = text;
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

    protected getHeaderBackground() {
        return this.headerBackground ? `background-image: url(${this.headerBackground})` : '';
    }

    protected onInputQuestion() {
        const content = this.textarea?.value;
        this.typing = !!content;
        const lineBreaks = (content?.match(/\n/g) || []).length;
        if (lineBreaks <= 10) {
            this.textarea?.setAttribute('style', 'height: auto');
            this.textarea?.setAttribute('style', `height: ${this.textarea?.scrollHeight.toString()}px`);
        }
    }

    override render() {
        return html`
        <div class="slots" style="display: none">
            <slot name="name"></slot>
            <slot name="description"></slot>
            <slot name="hint"></slot>
        </div>
        <button ?visible="${!this.open}" title="${this.__defaultInfo.name}" class="default qabot" @click="${this.toggleOpen}">${this.getAvatar()}</button>
        <div class="qabot card" ?busy="${this.busy}" ?visible="${this.open}" ?closing="${this.closing}">
            <button class="card__header" @click="${this.toggleOpen}" style="${this.getHeaderBackground()}">
                <span class="card__title">
                    <div class="icon avatar">${this.getAvatar()}</div>
                    <span class="card__title__content">
                        <span class="name">${this.botName?.[0]?.innerText || this.__defaultInfo.name}</span>
                        <span class="description">${this.botDescription?.[0]?.innerText || this.__defaultInfo.description}</span>
                    </span>
                </span>
                <i class="icon arrow-down">${downArrowCycle}</i>
            </button>
            <div class="card__content">
                <div class="qabot__answer-block">
                    ${this.getAnswerBlock()}
                </div>
                <div class="qabot__control">
                    <textarea maxlength="200" rows="1" tabindex="0" ?disabled="${this.busy}" @keypress="${this.onTextAreaInput}"
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
