import {css} from 'lit';


export const masterStyle = css`
    :host {
        --qabot-color-shadow: #0000000d;
        --qabot-color-background: #fff;
        --qabot-color-border: rgba(153, 153, 153, 0.25);

        --qabot-color-primary: #000;
        --qabot-color-action: #009191;
        --qabot-color-action-secondary: rgba(0, 145, 145, 0.05);
        --qabot-color-action-contrast: #fff;
        --qabot-color-muted: #646776;

        --qabot-size-text-primary: 0.75em;
        --qabot-size-line-height: 1.6;
        --qabot-size-text-title: 0.875em;
        --qabot-size-border-radius-primary: 1.25em;

        --qabot-color-card-header-background: #009191;
        --qabot-color-card-header-color: #fff;
        --qabot-card-header-height: calc(var(--qabot-size-text-title) + 4.5em);
    }

    :host([theme='dark']){
      --qabot-color-shadow: #0000000d;
      --qabot-color-background: #181818;
      --qabot-color-border: rgba(153, 153, 153, 0.25);

      --qabot-color-primary: #ffffff;
      --qabot-color-action: #FBCB67;
      --qabot-color-action-secondary: rgba(251, 203, 103, 0.1);
      --qabot-color-action-contrast: #181818;
      --qabot-color-muted: #81868d;

      --qabot-color-card-header-background: rgba(255, 255, 255, 0.1);
      --qabot-color-card-header-color: #fff;
    }

    @media (prefers-color-scheme: dark) {
        :host([theme='auto']){
            --qabot-color-shadow: #0000000d;
            --qabot-color-background: #181818;
            --qabot-color-border: rgba(153, 153, 153, 0.25);

            --qabot-color-primary: #ffffff;
            --qabot-color-action: #FBCB67;
            --qabot-color-action-secondary: rgba(251, 203, 103, 0.1);
            --qabot-color-action-contrast: #181818;
            --qabot-color-muted: #81868d;

            --qabot-color-card-header-background: rgba(255, 255, 255, 0.1);
            --qabot-color-card-header-color: #fff;
        }
    }

    :host {
        font-size: 1rem;
        width: 22.5em;
        height: 100%;
        max-height: 80%;
        position: fixed;
        bottom: 1.25em;
        right: 1.25em;
        z-index: 101;
    }

    @media (min-height: 90rem) {
        :host {
            max-height: 72rem;
        }
    }

    :host(:not([open])) {
        max-height: 3.75em;
        height: auto;
        width: auto;
    }
    :host([orientation='bottom-left']) {
        right: unset;
        top: unset;
        bottom: 1.25em;
        left: 1.25em;
    }
    :host([orientation='bottom-right']) {
        top: unset;
        bottom: 1.25em;
        right: 1.25em;
        left: unset
    }
    :host([orientation='top-right']) {
        top: 1.25em;
        bottom: unset;
        right: 1.25em;
        left: unset
    }
    :host([orientation='top-left']) {
        top: 1.25em;
        bottom: unset;
        right: unset;
        left: 1.25em;
    }
    :host([orientation='center']) {
        top: 50vh;
        bottom: unset;
        right: unset;
        left: 50vw;
        transform: translate(-50%, -50%);
    }


    .qabot.widget {
        width: 3.75em;
        height: 3.75em;
        border-radius: 50%;
        background-color: var(--qabot-color-action);
        text-align: center;
        box-shadow: 0 0.125em 0.9375em 0.0625em var(--qabot-color-border);
        opacity: 0;
        transform-origin: inherit;
        animation: 0.3s ease-in-out 0s forwards running slideIn;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .qabot.widget:hover {
        filter: brightness(0.8);
    }

    .qabot.widget svg {
        max-width: 80%;
        max-height: 80%;
    }

    .qabot.widget [fill]:not([fill='none']) {
        fill: var(--qabot-color-action-contrast);
    }

    .qabot.widget svg [stroke] {
        stroke: var(--qabot-color-action-contrast);
    }

    button:active {
        opacity: 0.8;
    }

    .qabot[busy] {
        cursor: wait;
    }

    .qabot:not([visible]) {
        display: none;
        opacity: 0;
    }

    :host([orientation='bottom-left']) .qabot {
        transform-origin: left bottom;
    }

    :host([orientation='bottom-right']) .qabot {
        transform-origin: right bottom;
    }

    :host([orientation='top-left']) .qabot {
        transform-origin: left top;
    }

    :host([orientation='top-right']) .qabot {
        transform-origin: right top;
    }

    :host([orientation='center']) .qabot {
        transform-origin: center center;
    }

    .card {
        box-shadow: 0 0.125em 0.9375em 0.0625em var(--qabot-color-border);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--qabot-color-background);
        border-radius: var(--qabot-size-border-radius-primary);
        color: var(--qabot-color-primary);
        fill: var(--qabot-color-primary);
        display: none;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
        box-sizing: border-box;
        opacity: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: all .3s ease-out;
    }

    .card[visible]:not([closing]) {
        display: flex;
        animation: 0.3s ease-in-out 0.1s forwards running slideIn;
    }
    .card[closing][visible] {
        display: flex;
        animation: 0.3s ease-in-out 0s forwards running slideOut;
    }

    .card .card__header {
        height: var(--qabot-card-header-height);
        padding: 1em;
        line-height: var(--qabot-size-line-height);
        font-size: var(--qabot-size-text-title);
        cursor: pointer;
        user-select: none;

        background-color: var(--qabot-color-card-header-background);
        color: var(--qabot-color-card-header-color);

        display: flex;
        font-weight: normal;
        align-items: center;
        justify-content: space-between;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
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
        background-color: white;
    }
    .card .card__title .avatar svg {
        max-width: 80%;
        max-height: 80%;
    }

    .card .arrow-down:hover {
        filter: brightness(0.8);
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
        border-top: 1px solid var(--qabot-color-border);
    }

    .qabot__control button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        border: none;
        right: 0;
        border-left: none;
        height: 100%;
        width: 3.25em;
        cursor: pointer;
        color: var(--qabot-color-action);
        fill: var(--qabot-color-action);
        background-color: transparent;
    }

    .qabot__control button [fill] {
        fill: var(--qabot-color-primary);
        fill-opacity: 0.2;
    }

    .qabot__control button:not(:disabled):hover [fill] {
        fill: var(--qabot-color-action);
        fill-opacity: 1;
        filter: brightness(0.85);
    }

    .qabot__control button[active]:not(:disabled) [fill] {
        fill: var(--qabot-color-action);
        fill-opacity: 1;
    }

    .qabot__control *:disabled {
        cursor: wait;
    }

    .qabot__control textarea {
        width: calc(100% - 4em);
        padding: 1.25em 0 1.25em 1em;

        border-right: none;
        font-size: var(--qabot-size-text-primary);
        resize: none;
        height: auto;
        max-height: 12em;

        overflow-y: scroll;
        overflow-y: overlay;
        scrollbar-width: none;
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

    .qabot .powered-by .icon .powered-by-img {
        max-height: 100%;
    }

    .answer-hint {
        width: 100%;
        padding-right: 0.5em;
        flex-shrink: 0;
        display: flex;
        align-items: flex-end;
        padding-bottom: 1em;
    }

    .answer-hint .answer-hint__content {
        max-width: calc(100% - 5.5em);
        border-radius: 1.15em 1.15em 1.15em 0.3125em;
        border: 0.0625em solid var(--qabot-color-action-secondary);
        background-color: var(--qabot-color-action-secondary);
        overflow: hidden;
    }

    .answer-hint .answer-hint__content .greeting {
        padding: 0.75em 1em;
        font-size: var(--qabot-size-text-primary);
        line-height: var(--qabot-size-line-height);
        font-weight: bold;
        color: var(--qabot-color-primary);
    }

    .answer-hint .answer-hint__content .question {
        background-color: var(--qabot-color-action-contrast);
        color: var(--qabot-color-action);
        font-size: var(--qabot-size-text-primary);
        line-height: var(--qabot-size-line-height);
        border-top: 0.0625em solid var(--qabot-color-action-secondary);
        padding: 0.5em 1em;
        display: block;
        cursor: pointer;
    }

    .answer-hint .answer-hint__content .question button[key] {
        width: 100%;
        height: 100%;
    }

    @media (hover:hover) {
        .answer-hint .answer-hint__content .question:hover {
            background-color: var(--qabot-color-action);
            color: var(--qabot-color-action-contrast);
        }
    }

    .card__content .avatar {
        width: 1.875em;
        height: 1.875em;
        border-radius: 50%;
        margin-right: 0.875em;
        background-color: white;
        flex-shrink: 0;
        border: 0.0625em solid var(--qabot-color-action-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card__content .avatar svg {
        max-width: 80%;
        max-height: 80%;
    }

    .avatar img, .qabot.widget img {
        max-height: 100%;
        max-width: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .answer-dialog {
        width: 100%;
        position: relative;
    }

    .bottom-line-detector {
        position: absolute;
        width: 1pt;
        height: 1pt;
        opacity: 0;
        bottom: 1em;
        left: 0;
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
        border: 0.0625em solid var(--qabot-color-action-secondary);
        overflow: hidden;
    }

    .qa-pair[multi-convo] .bubble {
        border-top-left-radius: 0.3125em;
    }

    .qa-pair[multi-convo][last-graph] .bubble {
        border-bottom-left-radius: 1.15em;
    }

    .qa-pair:not([last-graph]) .avatar {
        opacity: 0;
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
        text-align: left;
        font-size: var(--qabot-size-text-primary);
        line-height: var(--qabot-size-line-height);
    }

    .qa-pair .talktext > p {
        overflow-wrap: anywhere;
        padding: 0.75em 1em;
    }

    .qa-pair .talktext a {
        overflow-wrap: anywhere;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: var(--qabot-color-action);
    }

    .qa-pair .talktext > a {
        padding: 0 1em 1em;
        text-decoration: underline;
    }

    .qa-pair .talktext .multiple-links {
        background-color: var(--qabot-color-action-contrast);
        color: var(--qabot-color-action);
    }

    .qa-pair .talktext .multiple-links a {
        padding: 0.5em 1em;
    }

    .qa-pair .talktext .multiple-links a {
        border-top: 0.0625em solid var(--qabot-color-action-secondary);
    }

    .qa-pair .talktext .multiple-links a:hover {
        text-decoration: underline;
    }

    .qa-pair .question .bubble {
        color: var(--qabot-color-action-contrast);
        background-color: var(--qabot-color-action);
        border-radius: 1.15em 1.15em 0.3125em 1.15em;
    }

    .triple-dot {
        width: 3em;
        height: 1em;
    }

    .triple-dot .dot {
        height: 0.375em;
        width: 0.375em;
        border-radius: 50%;
        margin-left: 0.375em;
        transform-origin: center, center;
        animation: scaling 1.5s ease-in-out infinite;
        background-color: var(--qabot-color-action);
    }

    .triple-dot .dot:nth-child(2) {
        animation-delay: 250ms;
    }

    .triple-dot .dot:nth-child(3) {
       animation-delay: 500ms;
    }

    .qa-pair .answer .bubble .loading {
        cursor: wait;
        color: var(--qabot-color-action-contrast);
        fill: var(--qabot-color-action-contrast);
        margin: 1em;
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
        background-color: var(--qabot-color-action-secondary);
        cursor: pointer;
        height: 1.125em;
        width: 1.125em;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    @media (hover:hover) {
        .feedback-tooltip .thumbs .thumb:hover {
            transform: scale(1.2);
            filter: brightness(0.8);
        }
    }

    .feedback-tooltip .thumbs .thumb .icon {
        height: 0.5625em;
        width: 0.5625em;
    }

    .feedback-tooltip .thumbs .thumb:not(:first-child) {
        margin-left: 0.125em;
    }

    .feedback-tooltip .thumbs .thumb [fill], .feedback-tooltip .thumbs .thumb[active] [fill] {
        fill: var(--qabot-color-action);
    }

    .feedback-tooltip .answer-reference {
        cursor: pointer;
        color: var(--qabot-color-action);
        text-decoration: underline;
        font-size: var(--qabot-size-text-primary);
        margin: -0.875em 1em 1em;
        display: block;
    }

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: scale(0);
            display: none;
        }
        100% {
            opacity: 1;
            transform: scale(1);
            display: flex;
        }
    }

    @keyframes slideOut {
        0% {
            opacity: 1;
            transform: scale(1);
            display: flex;
        }
        100% {
            opacity: 0;
            transform: scale(0);
            display: none;
        }
    }
    @keyframes scaling {
        0% {
            opacity: 0.5;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1.5);
        }
        100% {
            opacity: 0.5;
            transform: scale(0.5);
        }
    }
    .avatar_eye_left {
        animation: avatar_eye_left_blink 10000ms linear infinite normal forwards
    }
    .card .avatar_eye_left {
        animation: none;
    }
    .avatar_eye_right {
        animation: avatar_eye_right_blink 10000ms linear infinite normal forwards
    }
    .card .avatar_eye_right {
        animation: none;
    }
    .avatar_header {
        animation: avatar_header_blink 10000ms linear infinite normal forwards
    }
    .card .avatar_header {
        animation: none;
    }
    @keyframes avatar_eye_left_blink {
        0% {
        transform: translate(98.6207px, 144.137956px) scale(1, 1);
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
        }
        2% {
            transform: translate(98.6207px, 144.137956px) scale(1, 0.291967);
            animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
        }
        4% {
            transform: translate(98.6207px, 144.137956px) scale(1, 1)
        }
        100% {
            transform: translate(98.6207px, 144.137956px) scale(1, 1)
        }
    }
    @keyframes avatar_eye_right_blink {
        0% {
            transform: translate(174.482765px, 144.137932px) scale(1, 1);
            animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
        }
        2% {
            transform: translate(174.482765px, 144.137932px) scale(1, 0.291966);
            animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1)
        }
        4% {
            transform: translate(174.482765px, 144.137932px) scale(1, 1)
        }
        100% {
            transform: translate(174.482765px, 144.137932px) scale(1, 1)
        }
    }

    .eOogTejGVnl11_ts {
        animation: eOogTejGVnl11_ts__ts 10000ms linear infinite normal forwards
    }

    @keyframes eOogTejGVnl11_ts__ts {
        0% {
            transform: translate(136.551727px, 22.758621px) scale(1, 1)
        }
        25% {
            transform: translate(136.551727px, 22.758621px) scale(1, 1);
            animation-timing-function: cubic-bezier(0, 0, 0.58, 1)
        }
        30% {
            transform: translate(136.551727px, 22.758621px) scale(1.666659, 1.666661)
        }
        100% {
            transform: translate(136.551727px, 22.758621px) scale(1.666659, 1.666661)
        }
    }

    .eOogTejGVnl11 {
        animation: eOogTejGVnl11_f_o 10000ms linear infinite normal forwards
    }

    @keyframes eOogTejGVnl11_f_o {
        0% {
            fill-opacity: 1
        }
        25% {
            fill-opacity: 1;
            animation-timing-function: cubic-bezier(0, 0, 0.58, 1)
        }
        30% {
            fill-opacity: 0
        }
        100% {
            fill-opacity: 0
        }
    }

`;


export default masterStyle;
