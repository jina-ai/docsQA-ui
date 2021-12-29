import { css } from 'lit';


export const masterStyle = css`
    :host {
        --qabot-color-shadow: #0000000d;
        --qabot-color-background: #fff;
        --qabot-color-padding: #f8f9fb;

        --qabot-color-primary: #000;
        --qabot-color-action: #009191;
        --qabot-color-action-contrast: #fff;
        --qabot-color-dimmed: #eeebee;
        --qabot-color-muted: #646776;

        --qabot-size-text-primary: 0.7em;
        --qabot-size-text-title: 1em;
        --qabot-size-border-radius-primary: 0.25em;

        --qabot-card-header-height: calc(var(--qabot-size-text-title) + 2.5em);
    }

    :host([theme='dark']){
      --qabot-color-shadow: #0000000d;
      --qabot-color-background: #18181a;
      --qabot-color-padding: #1e2124;

      --qabot-color-primary: #ffffffcc;
      --qabot-color-action: #fbcb67;
      --qabot-color-action-contrast: #202020;
      --qabot-color-dimmed: #303335;
      --qabot-color-muted: #81868d;
    }

    @media (prefers-color-scheme: dark) {
        :host([theme='auto']){
            --qabot-color-shadow: #0000000d;
            --qabot-color-background: #18181a;
            --qabot-color-padding: #1e2124;

            --qabot-color-primary: #ffffffcc;
            --qabot-color-action: #fbcb67;
            --qabot-color-action-contrast: #202020;
            --qabot-color-dimmed: #303335;
            --qabot-color-muted: #81868d;
        }
    }

    :host {
        font-size: 1rem;
        width: 16em;
        height: 100%;
        transition: transform 0.15s ease-in-out, max-height 0.15s ease-in-out;
        max-height: 25em;
        position: absolute;
        bottom: 0;
    }

    :host(:not([animate-by='position']):not([open])) {
        max-height: var(--qabot-card-header-height) !important;
    }

    :host([animate-by='position']:not([open])) {
        transform: translateY(calc(100% - var(--qabot-card-header-height)));
    }

    button:active {
        opacity: 0.8;
    }

    .qabot {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .qabot[busy] {
        cursor: wait;
    }

    .card {
        box-shadow: 0 0.1em 0.25em var(--qabot-color-shadow), 0 0 0.0625em rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--qabot-color-background);
        border: 1px solid var(--qabot-color-padding);
        border-radius: var(--qabot-size-border-radius-primary) var(--qabot-size-border-radius-primary) 0 0;
        color: var(--qabot-color-primary);
        fill: var(--qabot-color-primary);
        display: flex;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
    }

    .card .card__header {
        height: var(--qabot-card-header-height);
        padding: 1em;
        line-height: 1.15em;
        font-size: var(--qabot-size-text-title);
        cursor: pointer;
        user-select: none;

        background-color: var(--qabot-color-padding);

        border-bottom: 1px solid var(--qabot-color-padding);

        display: flex;
        font-weight: normal;
        align-items: center;
        justify-content: space-between;
    }

    .card .card__header:first-child {
        border-radius: calc(var(--qabot-size-border-radius-primary) - 1px) calc(var(--qabot-size-border-radius-primary) - 1px) 0 0;
    }

    .card .card__title {
        display: flex;
        align-items: center;
        column-gap: 0.75em;
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
        height: calc(100% - var(--qabot-card-header-height));
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .qabot__answer-block {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        min-height: 3em;
        overflow-y: scroll;
        scrollbar-width: thin;
        overflow: overlay;
        scroll-behavior: smooth;
        padding: 1em 1em 0 1em;
        -moz-padding-end: calc(1em - 10px);
    }

    .qabot__control {
        margin: 0 1em 1em 1em;
        display: flex;
        position: relative;
        line-height: 1.15em;
    }

    .qabot__control button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 var(--qabot-size-border-radius-primary) var(--qabot-size-border-radius-primary) 0;
        position: absolute;
        padding: 0.5em;
        border: none;
        right: 0;
        border: 1px solid var(--qabot-color-action);
        border-left: none;
        height: 100%;
        cursor: pointer;
        color: var(--qabot-color-action);
        fill: var(--qabot-color-action);
        background-color: var(--qabot-color-action-contrast);

        transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .qabot__control button:not(:disabled):hover {
        color: var(--qabot-color-action-contrast);
        fill: var(--qabot-color-action-contrast);
        background-color: var(--qabot-color-action);

        box-shadow: 0 0 0.15em var(--qabot-color-action);
    }

    .qabot__control *:disabled {
        cursor: wait;
    }

    .qabot__control textarea {
        width: 100%;
        padding: 0.72em 2.85em 0.72em 0.72em;
        border: 1px solid var(--qabot-color-action);
        border-right: none;
        border-radius: var(--qabot-size-border-radius-primary) calc(var(--qabot-size-border-radius-primary) + 6px) calc(var(--qabot-size-border-radius-primary) + 6px) var(--qabot-size-border-radius-primary);
        font-size: var(--qabot-size-text-primary);
        resize: none;

        overflow-y: scroll;
        overflow-y: overlay;
        scrollbar-width: none;
        transition: box-shadow 0.2s ease-in-out;
    }

    .qabot__control textarea::placeholder {
        color: var(--qabot-color-muted);
    }

    .qabot__control textarea:focus {
        box-shadow: 0 0 0.15em var(--qabot-color-action);
    }

    .qabot__control textarea:disabled {
        color: var(--qabot-color-muted);
    }

    .qabot .powered-by {
        position: absolute;
        display: flex;
        width: 100%;
        height: 1em;
        bottom: -1em;
        justify-content: center;
    }
    .qabot .powered-by .icon {
        width: auto;
        height: 100%;
    }

    .answer-hint {
        width: 100%;
        padding-right: 0.5em;
        line-height: 1.15em;
        display: block;
    }

    .answer-hint h1,.answer-hint h2,.answer-hint h3,.answer-hint h4,.answer-hint h5,
    .answer-hint h6,.answer-hint dt,.answer-hint ::slotted(h1),
    .answer-hint ::slotted(h2),.answer-hint ::slotted(h3),.answer-hint ::slotted(h4),
    .answer-hint ::slotted(h5),.answer-hint ::slotted(h6),.answer-hint ::slotted(dt) {
        margin: 0;
        margin-bottom: 0.75em;
        font-size: var(--qabot-size-text-primary);
        font-weight: bold;
        color: var(--qabot-color-primary);
    }

    .answer-hint p,.answer-hint li,.answer-hint dd,.answer-hint ::slotted(p),.answer-hint ::slotted(li),.answer-hint ::slotted(dd) {
        margin: 0;
        font-size: var(--qabot-size-text-primary);
        color: var(--qabot-color-muted);
        display: list-item;
        list-style-position: inside;
        padding-left: var(--qabot-size-text-primary);
        text-indent: calc(-1.3 * var(--qabot-size-text-primary));
        list-style-type: "•   ";
    }

    .answer-hint p::marker,.answer-hint li::marker,.answer-hint dd::marker,
    .answer-hint ::slotted(p)::marker,.answer-hint ::slotted(li)::marker,.answer-hint ::slotted(dd)::marker {
        content: '• ';
        font-weight: bold;
        white-space: pre-wrap;
        font-family: ui-monospace;
    }

    .answer-hint ul, .answer-hint ol, .answer-hint dl, .answer-hint ::slotted(ul),
    .answer-hint ::slotted(ol), .answer-hint ::slotted(dl) {
        color: var(--qabot-color-muted);
        padding: 0;
    }

    .answer-hint >*:last-child, .answer-hint ::slotted(*:last-child) {
        padding-bottom: 1em;
    }

    .answer-dialog {
        width: 100%;
    }

    .qa-pair {
        width: 100%;
    }
    .qa-pair:last-child {
        padding-bottom: 1em;
    }

    .qa-pair .bubble {
        display: inline-block;
        position: relative;
        height: auto;
        background-color: var(--qabot-color-action);
        color: var(--qabot-color-action-contrast);
        margin-bottom: 1.2em;
        border-radius: 0.3125em;
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
        bottom: -0.58em;
        border: 0.58em solid;
        border-color: transparent transparent transparent var(--qabot-color-action);
    }

    .qa-pair .qa-row.answer .talktext p::first-letter {
        text-transform: uppercase;
    }

    .qa-pair .qa-row.question {
        text-align: right;
    }

    .qa-pair:not(:first-child) {
        margin-top: 1em;
    }

    .qa-pair .talktext {
        padding: 1em;
        text-align: left;
        font-size: var(--qabot-size-text-primary);
    }

    .qa-pair .talktext p {
        overflow-wrap: anywhere;
    }

    .qa-pair .question .bubble {
        color: var(--qabot-color-primary);
        background-color: var(--qabot-color-dimmed);
    }

    .qa-pair .question .bubble:after {
        left: auto;
        right: 0;
        border-color: var(--qabot-color-dimmed) var(--qabot-color-dimmed) transparent transparent;
    }

    .qa-pair .bubble .feedback-tooltip {
        position: absolute;
        left: 1.5em;
        font-size: var(--qabot-size-text-primary);
        margin-top: 0.25em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: end;
        width: calc(100% - 2.5em);
        color: var(--qabot-color-action);
    }


    @keyframes blink {
        50% {
            fill: transparent
        }
    }

    .triple-dot {
        width: 3em;
        height: 1em;
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
        color: var(--qabot-color-action-contrast);
        fill: var(--qabot-color-action-contrast);
    }

    .feedback-tooltip .thumbs {
        display: flex;
        flex-direction: row;
        margin-left: 0.5em;
        align-items: center;
    }

    .feedback-tooltip .thumbs .thumb {
        color: var(--qabot-color-muted);
        fill: var(--qabot-color-muted);
        opacity: 0.5;

        cursor: pointer;
    }

    .feedback-tooltip .thumbs .thumb:not(:first-child) {
        margin-left: 0.25em;
    }

    .feedback-tooltip .thumbs .thumb:hover, .feedback-tooltip .thumbs .thumb[active] {
        color: var(--qabot-color-action);
        fill: var(--qabot-color-action);
        opacity: 1;
    }

    .answer-reference {
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .answer-reference .icon.link {
        width: 1em;
        margin-left: 0.25em;
    }
`;


export default masterStyle;
