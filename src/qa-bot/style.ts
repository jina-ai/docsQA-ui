import { css } from 'lit';


export const masterStyle = css`
    :host {
        --qabot-color-shadow: #0000000d;
        --qabot-color-background: #fff;
        --qabot-color-padding: #f8f9fb;

        --qabot-color-primary: #000;
        --qabot-color-action: #009191;
        --qabot-color-action-secondary: #F2F8F8;
        --qabot-color-action-contrast: #fff;
        --qabot-color-dimmed: #eeebee;
        --qabot-color-muted: #646776;

        --qabot-size-text-primary: 0.75em;
        --qabot-size-line-height: 1.25em;
        --qabot-size-text-title: 0.875em;
        --qabot-size-border-radius-primary: 1.25em;

        --qabot-card-header-height: calc(var(--qabot-size-text-title) + 4.5em);
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
        width: 22.5em;
        height: 100%;
        transition: transform 0.15s ease-in-out, max-height 0.15s ease-in-out;
        max-height: 80%;
        position: absolute;
        bottom: 1.25em;
    }

    :host(:not([open])) {
        max-height: 3.75em;
    }

    .default-qabot {
        width: 3.75em;
        height: 3.75em;
        border-radius: 50%;
        background-color: var(--qabot-color-action);
        text-align: center;
    }

    .default-qabot svg {
        width: 2.5em;
        height: 2em;
    }

    .default-qabot svg rect[fill], .default-qabot svg circle[fill], .default-qabot svg path[fill] {
        fill: var(--qabot-color-action-contrast);
    }

    .default-qabot svg rect[stroke] {
        stroke: var(--qabot-color-action-contrast);
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
        box-shadow: 0 0.125em 0.9375em 0.0625em var(--qabot-color-shadow), 0 0 0.0625em rgba(0, 0, 0, 0.15);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--qabot-color-background);
        border: 1px solid var(--qabot-color-padding);
        border-radius: var(--qabot-size-border-radius-primary);
        color: var(--qabot-color-primary);
        fill: var(--qabot-color-primary);
        display: flex;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
        box-sizing: border-box;
    }

    .card .card__header {
        height: var(--qabot-card-header-height);
        padding: 1em;
        line-height: var(--qabot-size-line-height);
        font-size: var(--qabot-size-text-title);
        cursor: pointer;
        user-select: none;

        background-color: var(--qabot-color-action);
        color: var(--qabot-color-action-contrast);

        border-bottom: 1px solid var(--qabot-color-padding);

        display: flex;
        font-weight: normal;
        align-items: center;
        justify-content: space-between;
    }

    .card .card__title {
        display: flex;
        align-items: center;
        column-gap: 0.75em;
    }

    .card .card__title .card__title__content {
        display: inline-flex;
        flex-direction: column;
    }

    .card .card__title .card__title__content .name {
        font-size: var(--qabot-size-text-title);
        font-weight: bold;
    }

    .card .card__title .card__title__content .description {
        font-size: var(--qabot-size-text-primary);
    }

    .card .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .card .card__title .avatar {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        background-color: var(--qabot-color-action-contrast);
    }

    .card .card__content {
        height: calc(100% - var(--qabot-card-header-height));
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        flex-shrink: 1;
    }

    .qabot__answer-block {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        flex-direction: column;
        overflow-y: scroll;
        scrollbar-width: thin;
        overflow: overlay;
        padding: 1em 1em 0 1em;
        -moz-padding-end: calc(1em - 10px);
    }

    .qabot__control {
        display: flex;
        position: relative;
        line-height: var(--qabot-size-line-height);
        border-top: 1px solid var(--qabot-color-action-secondary);
    }

    .qabot__control button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        padding: 0.5em;
        border: none;
        right: 0;
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
    }

    .qabot__control *:disabled {
        cursor: wait;
    }

    .qabot__control textarea {
        width: 100%;
        padding: 1.25em 1em;

        border-right: none;
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
        max-width: calc(100% - 5.5em);
        padding-right: 0.5em;
        line-height: var(--qabot-size-line-height);
        flex-shrink: 0;
        display: flex;
        align-items: flex-end;
        padding-bottom: 1em;
    }

    .answer-hint .answer-hint__content {
        border-radius: 1.15em 1.15em 1.15em 0.3125em;
        border: 0.0625em solid var(--qabot-color-action-secondary);
        background-color: var(--qabot-color-action-secondary);
        overflow: hidden;
    }

    .answer-hint .answer-hint__content .greeting {
        padding: 0.5em 1em;
        font-size: var(--qabot-size-text-primary);
        font-weight: bold;
        color: var(--qabot-color-primary);
    }

    .answer-hint .answer-hint__content .question {
        background-color: var(--qabot-color-action-contrast);
        color: var(--qabot-color-action);
        font-size: var(--qabot-size-text-primary);
        border-bottom: 0.0625em solid var(--qabot-color-action-secondary);
        padding: 0.5em 1em;
        display: block;
        cursor: pointer;
    }

    .answer-hint .answer-hint__content .question:hover {
        background-color: var(--qabot-color-action);
        color: var(--qabot-color-action-contrast);
    }

    .card__content .avatar {
        width: 1.875em;
        height: 1.875em;
        border-radius: 50%;
        margin-right: 0.875em;
        background-color: var(--qabot-color-action-contrast);
        flex-shrink: 0;
        border: 0.0625em solid var(--qabot-color-action-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .avatar svg {
        width: calc(100% - 0.5em);
        height: calc(100% - 0.5em);
    }

    .avatar img {
        height: 100%;
        width: 100%;
        object-fit: contain;
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

    .qa-pair .qa-row {
        margin-bottom: 1em;
    }

    .qa-pair .qa-row.answer {
        display: flex;
        align-items: flex-end;
    }

    .qa-pair .bubble {
        display: inline-block;
        position: relative;
        height: auto;
        background-color: var(--qabot-color-action-secondary);
        color: var(--qabot-color-primary);
        border-radius: 1.15em 1.15em 1.15em 0.3125em;
        max-width: calc(100% - 5.5em);
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
        line-height: var(--qabot-size-line-height);
    }

    .qa-pair .talktext p {
        overflow-wrap: anywhere;
    }

    .qa-pair .talktext a {
        overflow-wrap: anywhere;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: var(--qabot-color-action);
        text-decoration: underline;
        margin-top: 0.125em;
    }

    .qa-pair .question .bubble {
        color: var(--qabot-color-action-contrast);
        background-color: var(--qabot-color-action);
        border-radius: 1.15em 1.15em 0.3125em 1.15em;
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

    .qa-pair .answer:hover .feedback-tooltip .thumbs {
        display: flex
    }

    .feedback-tooltip .thumbs {
        display: none;
        flex-direction: row;
        margin-left: 0.25em;
        align-items: center;
        width: 2.5em;
    }

    .feedback-tooltip .thumbs .thumb {
        color: var(--qabot-color-muted);
        fill: var(--qabot-color-action);
        background-color: var(--qabot-color-action-secondary);

        cursor: pointer;
        height: 1.125em;
        width: 1.125em;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .feedback-tooltip .thumbs .thumb .icon {
        height: 0.5625em;
        width: 0.5625em;
    }

    .feedback-tooltip .thumbs .thumb:not(:first-child) {
        margin-left: 0.125em;
    }

    .feedback-tooltip .thumbs .thumb:hover, .feedback-tooltip .thumbs .thumb[active] {
        color: var(--qabot-color-action);
        fill: var(--qabot-color-action);
    }
`;


export default masterStyle;
