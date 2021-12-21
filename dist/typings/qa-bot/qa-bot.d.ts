import { LitElement, PropertyValues } from 'lit';
import { JinaQABotController, QAPair } from './controller';
export declare class QaBot extends LitElement {
    label: string;
    server?: string;
    site?: string;
    target?: string;
    theme?: 'auto' | 'dark' | 'light' | string;
    animateBy?: 'position' | 'height';
    open?: boolean;
    protected qaControl?: JinaQABotController;
    protected textarea?: HTMLTextAreaElement;
    constructor();
    static styles: import("lit").CSSResult[];
    update(changedProps: PropertyValues): void;
    protected onTextAreaInput(event: KeyboardEvent): void;
    submitQuestion(): Promise<void>;
    protected submitFeedback(qaPair: QAPair, feedback?: 'up' | 'down' | 'none'): Promise<(Response & {
        data: any;
    } & {
        serial: number;
        config: import("../lib/http-service").HTTPServiceRequestOptions;
    }) | undefined>;
    scrollDialogToBottom(): Promise<void>;
    toggleOpen(): void;
    protected makeReferenceLink(uri: string): string;
    protected getSingleQAComp(qa: QAPair): import("lit-html").TemplateResult<1>;
    protected getAnswerBlock(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
