import { css } from 'lit';


export const masterStyle = css`
    :host {
        --jina-qabot-color-shadow: #0000000d;
        --jina-qabot-color-background: #fff;
        --jina-qabot-color-padding: #f8f9fb;

        --jina-qabot-color-primary: #000;
        --jina-qabot-color-action: #009191;
        --jina-qabot-color-action-contrast: #fff;
        --jina-qabot-color-dimmed: #eeebee;
        --jina-qabot-color-muted: #646776;

        --jina-qabot-size-text-primary: 0.7rem;
        --jina-qabot-size-text-title: 1rem;
        --jina-qabot-size-border-radius-primary: 0.25rem;

        --jina-docbot-card-header-height: calc(var(--jina-qabot-size-text-title) + 2.5rem);
    }

    :host([theme='dark']){
      --jina-qabot-color-shadow: #0000000d;
      --jina-qabot-color-background: #18181a;
      --jina-qabot-color-padding: #1e2124;

      --jina-qabot-color-primary: #ffffffcc;
      --jina-qabot-color-action: #fbcb67;
      --jina-qabot-color-action-contrast: #202020;
      --jina-qabot-color-dimmed: #303335;
      --jina-qabot-color-muted: #81868d;
    }

    @media (prefers-color-scheme: dark) {
        :host([theme='auto']){
            --jina-qabot-color-shadow: #0000000d;
            --jina-qabot-color-background: #18181a;
            --jina-qabot-color-padding: #1e2124;

            --jina-qabot-color-primary: #ffffffcc;
            --jina-qabot-color-action: #fbcb67;
            --jina-qabot-color-action-contrast: #202020;
            --jina-qabot-color-dimmed: #303335;
            --jina-qabot-color-muted: #81868d;
        }
    }

    :host {
        width: 16rem;
        height: 100%;
        transition: transform 0.15s ease-in-out, max-height 0.15s ease-in-out;
        max-height: 25rem;
        position: absolute;
        bottom: 0;
    }

    :host(:not([animate-by='position']):not([open])) {
        max-height: var(--jina-docbot-card-header-height) !important;
    }

    :host([animate-by='position']:not([open])) {
        transform: translateY(calc(100% - var(--jina-docbot-card-header-height)));
    }

    button:active {
        opacity: 0.8;
    }

    .jina-qabot {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: var(--jina-qabot-size-text-primary);
    }

    .jina-qabot[busy] {
        cursor: wait;
    }

    .card {
        box-shadow: 0 0.1rem 0.25rem var(--jina-qabot-color-shadow), 0 0 0.0625rem rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--jina-qabot-color-background);
        border: 1px solid var(--jina-qabot-color-padding);
        border-radius: var(--jina-qabot-size-border-radius-primary) var(--jina-qabot-size-border-radius-primary) 0 0;
        color: var(--jina-qabot-color-primary);
        fill: var(--jina-qabot-color-primary);
        display: flex;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
    }

    .card .card__header {
        height: var(--jina-docbot-card-header-height);
        padding: 1rem;
        line-height: 1.15rem;
        font-size: var(--jina-qabot-size-text-title);
        cursor: pointer;
        user-select: none;

        background-color: var(--jina-qabot-color-padding);

        border-bottom: 1px solid var(--jina-qabot-color-padding);

        display: flex;
        font-weight: normal;
        align-items: center;
        justify-content: space-between;
    }

    .card .card__header:first-child {
        border-radius: calc(var(--jina-qabot-size-border-radius-primary) - 1px) calc(var(--jina-qabot-size-border-radius-primary) - 1px) 0 0;
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

    .card .card__content {
        height: calc(100% - var(--jina-docbot-card-header-height));
        overflow: hidden;
        overflow: overlay;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .jina-qabot__answer-block {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        min-height: 3rem;
        overflow-y: scroll;
        scrollbar-width: thin;
        overflow: overlay;
        scroll-behavior: smooth;
        padding: 1rem 0.5rem 0 1rem;
    }

    .jina-qabot__control {
        margin: 0 1rem 1rem 1rem;
        display: flex;
        position: relative;
        line-height: 1.15rem;
    }

    .jina-qabot__control button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 calc(var(--jina-qabot-size-border-radius-primary) - 1px) calc(var(--jina-qabot-size-border-radius-primary) - 1px) 0;
        position: absolute;
        padding: 0.5rem;
        border: none;
        right: 1px;
        top: 1px;
        height: calc(100% - 2px);
        cursor: pointer;

        font-size: 1rem;
        color: var(--jina-qabot-color-action);
        fill: var(--jina-qabot-color-action);
        background-color: var(--jina-qabot-color-action-contrast);

        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .jina-qabot__control button:not(:disabled):hover {
        color: var(--jina-qabot-color-action-contrast);
        fill: var(--jina-qabot-color-action-contrast);
        background-color: var(--jina-qabot-color-action);

        box-shadow: 0 0 0.15rem var(--jina-qabot-color-action);
    }

    .jina-qabot__control *:disabled {
        cursor: wait;
    }

    .jina-qabot__control textarea {
        width: 100%;
        padding: 0.5rem calc(1.5rem + 0.5rem) 0.5rem 0.5rem;
        border: 1px solid var(--jina-qabot-color-action);
        border-radius: var(--jina-qabot-size-border-radius-primary);
        font-size: var(--jina-qabot-size-text-primary);
        resize: none;

        overflow-y: scroll;
        overflow-y: overlay;
        scrollbar-width: none;
        transition: box-shadow 0.2s ease-in-out;
    }

    .jina-qabot__control textarea:focus {
        box-shadow: 0 0 0.15rem var(--jina-qabot-color-action);
    }

    .jina-qabot__control textarea:disabled {
        color: var(--jina-qabot-color-muted);
    }

    .jina-qabot .powered-by {
        position: absolute;
        display: flex;
        width: 100%;
        height: 1rem;
        bottom: -1rem;
        justify-content: center;
    }
    .jina-qabot .powered-by .icon {
        width: auto;
        height: 100%;
    }

    .answer-hint {
        width: 100%;
        padding-right: 0.5rem;
        line-height: 1.15rem;
        display: block;
    }

    .answer-hint h1,h2,h3,h4,h5,h6,dt,::slotted(h1),
        ::slotted(h2),::slotted(h3),::slotted(h4),
        ::slotted(h5),::slotted(h6),::slotted(dt) {
        margin: 0;
        margin-bottom: 0.75rem;
        font-size: var(--jina-qabot-size-text-primary);
        font-weight: bold;
        color: var(--jina-qabot-color-primary);
    }

    .answer-hint p,li,dd,::slotted(p),::slotted(li),::slotted(dd) {
        margin: 0;
        font-size: var(--jina-qabot-size-text-primary);
        color: var(--jina-qabot-color-muted);
        display: list-item;
        list-style-position: inside;
        padding-left: 1rem;
        text-indent: -0.9rem;
        list-style-type: "•   ";
    }

    .answer-hint p::marker,li::marker,dd::marker,
        ::slotted(p)::marker,::slotted(li)::marker,::slotted(dd)::marker {
        content: '• ';
        font-weight: 1;
        white-space: pre-wrap;
        font-family: monospace;
    }

    .answer-hint ul, ol, ::slotted(ul), ::slotted(ol) {
        font-size: var(--jina-qabot-size-text-primary);
        color: var(--jina-qabot-color-muted);
        padding: 0;
    }

    .answer-hint >*:last-child, ::slotted(*:last-child) {
        padding-bottom: 1rem;
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
        background-color: var(--jina-qabot-color-action);
        color: var(--jina-qabot-color-action-contrast);
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
        border-color: transparent transparent transparent var(--jina-qabot-color-action);
    }

    .qa-pair .qa-row.question {
        text-align: right;
    }

    .qa-pair:not(:first-child) {
        margin-top: 1rem;
    }

    .qa-pair .talktext {
        padding: 1em;
        text-align: left;
    }

    .qa-pair .talktext p {
        overflow-wrap: anywhere;
    }

    .qa-pair .question .bubble {
        color: var(--jina-qabot-color-primary);
        background-color: var(--jina-qabot-color-dimmed);
    }

    .qa-pair .question .bubble:after {
        left: auto;
        right: 0;
        border-color: var(--jina-qabot-color-dimmed) var(--jina-qabot-color-dimmed) transparent transparent;
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
        color: var(--jina-qabot-color-action);
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
        color: var(--jina-qabot-color-action-contrast);
        fill: var(--jina-qabot-color-action-contrast);
    }

    .feedback-tooltip .thumbs {
        display: flex;
        flex-direction: row;
        margin-left: 0.5rem;
        align-items: center;
    }

    .feedback-tooltip .thumbs .thumb {
        color: var(--jina-qabot-color-dimmed);
        fill: var(--jina-qabot-color-dimmed);

        cursor: pointer;
    }

    .feedback-tooltip .thumbs .thumb:not(:first-child) {
        margin-left: 0.25rem;
    }

    .feedback-tooltip .thumbs .thumb:hover, .feedback-tooltip .thumbs .thumb[active] {
        color: var(--jina-qabot-color-action);
        fill: var(--jina-qabot-color-action);
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
