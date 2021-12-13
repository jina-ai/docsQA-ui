import { css } from 'lit';


export const masterStyle = css`
    :host {
        --jina-docbot-color-shadow: #0000000d;
        --jina-docbot-color-background-primary: #fff;
        --jina-docbot-color-border-primary: #f8f9fb;
        --jina-docbot-color-text-primary: #000;

        --jina-docbot-color-action: #009191;
        --jina-docbot-color-action-reverse: #fff;

        --jina-docbot-color-background-header: #f8f9fb;
        --jina-docbot-color-border-header: #f8f9fb;
        --jina-docbot-color-border-action: #009191;


        --jina-docbot-color-text-muted: #646776;

        --jina-docbot-size-text-primary: 0.7rem;
        --jina-docbot-size-text-title: 1rem;
        --jina-docbot-size-border-radius-primary: 0.25rem;
    }

    :host {
        width: 16rem;
        position: fixed;
        bottom: 0;
    }

    button:active {
        opacity: 0.8;
    }

    .jina-doc-bot {
        position: relative;
        width: 100%;
        overflow: hidden;
        font-size: var(--jina-docbot-size-text-primary);
    }

    .card {
        box-shadow: 0 0.1rem 0.25rem var(--jina-docbot-color-shadow), 0 0 0.0625rem rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--jina-docbot-color-background-primary);
        border: 1px solid var(--jina-docbot-color-border-primary);
        border-radius: var(--jina-docbot-size-border-radius-primary) var(--jina-docbot-size-border-radius-primary) 0 0;
        color: var(--jina-docbot-color-text-primary);
        display: flex;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
        transition: transform 0.15s ease-in-out;
    }

    .card .card__header {
        height: calc(var(--jina-docbot-size-text-title) + 2.5rem);
        padding: 1rem;
        line-height: 1.15rem;
        font-size: var(--jina-docbot-size-text-title);
        cursor: pointer;
        user-select: none;

        background-color: var(--jina-docbot-color-background-header);

        border-bottom: 1px solid var(--jina-docbot-color-border-header);

        display: flex;
        font-weight: normal;
        align-items: center;
        justify-content: space-between;
    }

    .card .card__header:first-child {
        border-radius: calc(var(--jina-docbot-size-border-radius-primary) - 1px) calc(var(--jina-docbot-size-border-radius-primary) - 1px) 0 0;
    }

    .card .card__title {
        display: flex;
        align-items: center;
    }

    .card .icon {
        display: inline-flex;
    }

    :host([open]) .card__header .icon.arrow-up {
        display: none;
    }

    :host(:not([open])) .card__header .icon.arrow-down {
        display: none;
    }

    ::slotted(*) {
        margin: 0;
    }

    .card .card__content {
        overflow: hidden;
        padding: 1rem;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    :host(:not([open])) .card{
        transform: translateY(calc(100% - (var(--jina-docbot-size-text-title) + 2.5rem)));
    }

    .jina-doc-answer-hint h1,h2,h3,h4,h5,h6, ::slotted(h1),
        ::slotted(h2), ::slotted(h3), ::slotted(h4),
        ::slotted(h5), ::slotted(h6) {
        margin-bottom: 0.75rem;
        font-size: var(--jina-docbot-size-text-primary);
        font-weight: bold;
        color: var(--jina-docbot-color-text-primary);
    }
    .jina-doc-answer-hint p, ::slotted(p){
        position: relative;
        font-size: var(--jina-docbot-size-text-primary);
        color: var(--jina-docbot-color-text-muted);
        padding-left: 1rem;
    }

    .jina-doc-answer-hint p::before, ::slotted(p)::before{
        content: '•';
        position: absolute;
        left: 0;
        font-size: var(--jina-docbot-size-text-primary);
        color: var(--jina-docbot-color-text-muted);
    }

    .jina-doc-answer-hint ul, ol, ::slotted(ul), ::slotted(ol){
        font-size: var(--jina-docbot-size-text-primary);
        padding-left: 1.2rem;
        color: var(--jina-docbot-color-text-muted);
    }

    .jina-doc-bot__answer-block {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        max-height: 46vh;
        height: 15rem;
        overflow: overlay;
    }

    .jina-doc-bot__control {
        margin-top: 1rem;
        display: flex;
        position: relative;
    }

    .jina-doc-bot__control button{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 calc(var(--jina-docbot-size-border-radius-primary) - 1px) calc(var(--jina-docbot-size-border-radius-primary) - 1px) 0;
        position: absolute;
        padding: 1.5rem;
        border: 1px solid var(--jina-docbot-color-border-action);
        right: 1px;
        top: 1px;
        height: calc(100% - 2px);
        cursor: pointer;

        font-size: 1rem;
        color: var(--jina-docbot-color-action);
        fill: var(--jina-docbot-color-action);
        background-color: var(--jina-docbot-color-action-reverse);

        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .jina-doc-bot__control button:hover{
        color: var(--jina-docbot-color-action-reverse);
        fill: var(--jina-docbot-color-action-reverse);
        background-color: var(--jina-docbot-color-action);

        box-shadow: 0 0 2px var(--jina-docbot-color-border-action);
    }

    .jina-doc-bot__control textarea{
        width: 100%;
        padding: 0.5rem calc(1.5rem + 0.5rem) 0.5rem 0.5rem;
        border: 1px solid var(--jina-docbot-color-border-action);
        border-radius: var(--jina-docbot-size-border-radius-primary);
        font-size: var(--jina-docbot-size-text-primary);
        resize: none;
        overflow-y: scroll;
        transition: box-shadow 0.2s ease-in-out;
    }

    .jina-doc-bot__control textarea:focus{
        box-shadow: 0 0 2px var(--jina-docbot-color-border-action);
    }

    .jina-doc-bot .powered-by {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .jina-doc-bot .powered-by .icon {
        width: auto;
        height: 1rem;
    }

    @keyframes blink {
        50% {
            fill: transparent
        }
    }

    .triple-dot {
        animation: 1s blink infinite;
        fill: var(--color-background-primary);
    }

    .triple-dot:nth-child(2) {
        animation-delay: 250ms
    }

    .triple-dot:nth-child(3) {
        animation-delay: 500ms
    }

    .example-question {
        color: var(--jina-docbot-color-text-muted);
    }
`;


export default masterStyle;
