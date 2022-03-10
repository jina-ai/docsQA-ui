import 'reflect-metadata';
import { LitElement, PropertyValues } from 'lit';
import { JinaQABotController } from './controller';
import { ANSWER_RENDER_TEMPLATE, QAPair } from './shared';
import { AnswerRenderer } from './answer-renderers';
import { xorDecryptB64EncodedUtf8, xorEncryptStringUtf8B64 } from '../lib/crypto';
import { PatchFunction } from './patches';
export declare class QaBot extends LitElement {
    botAvatar?: string;
    title: string;
    description?: string;
    headerBackground?: string;
    orientation: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center';
    token?: string;
    server?: string;
    site?: string;
    target?: string;
    channel?: string;
    theme?: 'auto' | 'dark' | 'light' | 'infer' | string;
    fgColor?: string;
    bgColor?: string;
    inferredThemeVariables: {
        'color-background': string;
        'color-border': string;
        'color-primary': string;
        'color-action': string;
        'color-action-secondary': string;
        'color-action-contrast': string;
        'color-action-contrast-secondary': string;
        'color-card-header-background': string;
        'color-card-header-color': string;
    };
    poweredByIconSrc?: string;
    open?: boolean;
    get busy(): boolean;
    protected typing: boolean;
    protected closing: boolean;
    protected qaControl?: JinaQABotController;
    protected textarea?: HTMLTextAreaElement;
    protected bottomLineDetector?: HTMLElement;
    protected lastBottomLineDetector?: HTMLElement;
    protected bottomLineObserver: IntersectionObserver;
    protected themeMightChangeObserver: MutationObserver;
    scrolledToBottom?: boolean;
    smallViewPort?: boolean;
    protected slotName?: Array<HTMLElement>;
    protected slotDescription?: Array<HTMLElement>;
    protected slotDefault?: Array<HTMLElement>;
    protected slotGreetings?: Array<HTMLElement>;
    protected slotTexts?: Array<HTMLElement>;
    preferences: {
        name: string;
        description: string;
        greeting: string;
        questions: string[];
        texts: {
            feedbackThumbUp: string[];
            feedbackThumbDown: string[];
            contextHref: string;
            unknownError: string;
            networkError: string;
            serverError: string;
        };
    };
    debugEnabled?: boolean;
    private __debugEventListener?;
    answerRenderer: {
        [k in ANSWER_RENDER_TEMPLATE]: AnswerRenderer;
    };
    patches: PatchFunction[];
    protected __everScrolledToBottom: boolean;
    private __syncOptionsRoutine;
    private __onScreenResizeRoutine;
    private __inferThemeRoutine;
    constructor();
    protected applyPatches(): void;
    protected __detectViewPort(): void;
    protected __observeBottomLine(): Promise<void>;
    protected debouncedScrollToBottom(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static styles: import("lit").CSSResult[];
    update(changedProps: PropertyValues): void;
    protected autoScrollTo(): Promise<void>;
    updated(): void;
    protected onTextAreaInput(event: KeyboardEvent): void;
    setQaPairTargeted(qaPair?: QAPair): void;
    reInferTheme(): Promise<void>;
    protected setupDebugEventListener(flag?: boolean): void;
    debugCommands(input: string): void;
    submitQuestion(etc?: object): Promise<void>;
    submitTypedQuestion(): Promise<void>;
    protected submitFeedback(qaPair: QAPair, feedback?: 'up' | 'down' | 'none'): Promise<void>;
    scrollDialogToBottom(behavior?: 'smooth' | 'auto'): Promise<void>;
    scrollToAnswerByRequestId(requestId: string, behavior?: 'smooth' | 'auto'): Promise<void>;
    toggleOpen(): Promise<void>;
    closeCard(): Promise<void>;
    openCard(): void;
    protected makeReferenceLink(uri?: string): string;
    protected getSingleQAComp(qa: QAPair, index: number): import("lit-html").TemplateResult<1>;
    protected getFeedbackTooltip(qa: QAPair): import("lit-html").TemplateResult<1>;
    protected renderAnswerBubble(qaPair: QAPair): any;
    __loadFromSlot(elems?: HTMLElement[], selector?: string): HTMLElement | undefined;
    loadPreferences(): void;
    protected inferTheme(): ([number, number, number] | {
        'color-background': string;
        'color-border': string;
        'color-primary': string;
        'color-action': string;
        'color-action-secondary': string;
        'color-action-contrast': string;
        'color-action-contrast-secondary': string;
        'color-card-header-background': string;
        'color-card-header-color': string;
    } | "dark" | "light" | undefined)[];
    private __setUpThemeMightChangeObserver;
    private __suspendThemeMightChangeObserver;
    protected xorDecryptB64EncodedUtf8: typeof xorDecryptB64EncodedUtf8;
    protected xorEncryptStringUtf8B64: typeof xorEncryptStringUtf8B64;
    protected getAnswerBlock(): import("lit-html").TemplateResult<1>;
    protected onClickQuestion(e: Event): void;
    protected getAvatar(): import("lit-html").TemplateResult<1 | 2>;
    protected onInputQuestion(): void;
    render(): import("lit-html").TemplateResult<1>;
}