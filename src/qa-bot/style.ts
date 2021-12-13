import { css } from 'lit';


export const masterStyle = css`
    :host {
        --jina-docbot-color-shadow: #0000000d;
        --jina-docbot-color-background-primary: #fff;
        --jina-docbot-color-border-primary: #f8f9fb;


        --jina-docbot-color-primary: #000;
        --jina-docbot-color-action: #009191;
        --jina-docbot-color-action-reverse: #fff;
        --jina-docbot-color-dimmed: #eeebee;
        --jina-docbot-color-muted: #646776;

        --jina-docbot-color-background-header: #f8f9fb;
        --jina-docbot-color-border-header: #f8f9fb;
        --jina-docbot-color-border-action: #009191;



        --jina-docbot-size-text-primary: 0.7rem;
        --jina-docbot-size-text-title: 1rem;
        --jina-docbot-size-border-radius-primary: 0.25rem;
    }

    :host {
        width: 16rem;
        position: fixed;
        bottom: 0;
        height: 25rem;
    }

    button:active {
        opacity: 0.8;
    }

    .jina-doc-bot {
        position: relative;
        width: 100%;
        height: 100%;
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
        color: var(--jina-docbot-color-primary);
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
        height: calc(100% - (var(--jina-docbot-size-text-title) + 2.5rem));

        overflow: overlay;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    :host(:not([open])) .card {
        transform: translateY(calc(100% - (var(--jina-docbot-size-text-title) + 2.5rem)));
    }

    .jina-doc-bot__answer-block {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: overlay;

        overflow: overlay;
        scroll-behavior: smooth;
        padding: 1rem 0.5rem 0 1rem;
    }

    .jina-doc-bot__control {
        margin: 0 1rem 1rem 1rem;
        display: flex;
        position: relative;
    }

    .jina-doc-bot__control button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 calc(var(--jina-docbot-size-border-radius-primary) - 1px) calc(var(--jina-docbot-size-border-radius-primary) - 1px) 0;
        position: absolute;
        padding: 0.5rem;
        border: none;
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

    .jina-doc-bot__control button:not(:disabled):hover {
        color: var(--jina-docbot-color-action-reverse);
        fill: var(--jina-docbot-color-action-reverse);
        background-color: var(--jina-docbot-color-action);

        box-shadow: 0 0 0.15rem var(--jina-docbot-color-border-action);
    }

    .jina-doc-bot__control *:disabled {
        cursor: wait;
    }

    .jina-doc-bot__control textarea {
        width: 100%;
        padding: 0.5rem calc(1.5rem + 0.5rem) 0.5rem 0.5rem;
        border: 1px solid var(--jina-docbot-color-border-action);
        border-radius: var(--jina-docbot-size-border-radius-primary);
        font-size: var(--jina-docbot-size-text-primary);
        resize: none;
        overflow-y: scroll;
        transition: box-shadow 0.2s ease-in-out;
    }

    .jina-doc-bot__control textarea:focus {
        box-shadow: 0 0 0.15rem var(--jina-docbot-color-border-action);
    }

    .jina-doc-bot__control textarea:disabled {
        color: var(--jina-docbot-color-muted);
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

    .answer-hint h1,h2,h3,h4,h5,h6, ::slotted(h1),
        ::slotted(h2), ::slotted(h3), ::slotted(h4),
        ::slotted(h5), ::slotted(h6) {
        margin-bottom: 0.75rem;
        font-size: var(--jina-docbot-size-text-primary);
        font-weight: bold;
        color: var(--jina-docbot-color-primary);
    }
    .answer-hint p, ::slotted(p) {
        position: relative;
        font-size: var(--jina-docbot-size-text-primary);
        color: var(--jina-docbot-color-muted);
        padding-left: 1rem;
    }

    .answer-hint p::before, ::slotted(p)::before {
        content: '•';
        position: absolute;
        left: 0;
        font-size: var(--jina-docbot-size-text-primary);
        color: var(--jina-docbot-color-muted);
    }

    .answer-hint ul, ol, ::slotted(ul), ::slotted(ol) {
        font-size: var(--jina-docbot-size-text-primary);
        padding-left: 1.2rem;
        color: var(--jina-docbot-color-muted);
    }

    .answer-dialog {
        width: 100%;
    }

    .qa-pair {
        padding: 0 0.5rem 0 0;
        width: 100%;
    }
    .qa-pair:last-child {
        padding-bottom: 1rem;
    }

    .qa-pair .bubble {
        display: inline-block;
        position: relative;
        height: auto;
        background-color: var(--jina-docbot-color-action);
        color: var(--jina-docbot-color-action-reverse);
        margin-bottom: 20px;
        border-radius: 5px;
        max-width: 80%;
    }

    .qa-pair .bubble:after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
        left: 0;
        right: auto;
        top: auto;
        bottom: -10px;
        border: 10px solid;
        border-color: transparent transparent transparent var(--jina-docbot-color-action);
    }

    .qa-pair .qa-row.question {
        text-align: right;
    }

    .qa-pair .talktext {
        padding: 1em;
        text-align: left;
    }

    .qa-pair .talktext p {
        overflow-wrap: anywhere;
    }

    .qa-pair .question .bubble {
        color: var(--jina-docbot-color-primary);
        background-color: var(--jina-docbot-color-dimmed);
    }

    .qa-pair .question .bubble:after {
        left: auto;
        right: 0;
        border-color: var(--jina-docbot-color-dimmed) var(--jina-docbot-color-dimmed) transparent transparent;
    }

    .qa-pair .bubble .feedback-tooltip {
        bottom: -1.25rem;
        position: absolute;
        left: 1.25rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 1.25rem - 0.75rem);
        color: var(--jina-docbot-color-action);
    }


    @keyframes blink {
        50% {
            fill: transparent
        }
    }

    .triple-dot .dot{
        animation: 1s blink infinite;
    }

    .triple-dot .dot:nth-child(2) {
        animation-delay: 250ms
    }

    .triple-dot .dot:nth-child(3) {
        animation-delay: 500ms
    }

    .qa-pair .answer .bubble .loading {
        cursor: wait;
        color: var(--jina-docbot-color-action-reverse);
        fill: var(--jina-docbot-color-action-reverse);
    }

    .feedback-tooltip .thumbs {
        display: flex;
        flex-direction: row;
        margin-left: 0.5rem;
        align-items: center;
    }

    .feedback-tooltip .thumbs .thumb {
        color: var(--jina-docbot-color-dimmed);
        fill: var(--jina-docbot-color-dimmed);

        cursor: pointer;
    }

    .feedback-tooltip .thumbs .thumb:not(:first-child) {
        margin-left: 0.25rem;
    }

    .feedback-tooltip .thumbs .thumb:hover {
        color: var(--jina-docbot-color-action);
        fill: var(--jina-docbot-color-action);
    }

    .answer-reference {
        white-space: nowrap;
        cursor: pointer;
    }
    .answer-reference:after {
        content: url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23607D8B' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M0 0h24v24H0z' stroke='none'/%3E%3Cpath d='M11 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M10 14L20 4M15 4h5v5'/%3E%3C/svg%3E");
        margin: 0 .25rem;
        vertical-align: middle;
        color: var(--color-sidebar-link-text);
    }
`;


export default masterStyle;
