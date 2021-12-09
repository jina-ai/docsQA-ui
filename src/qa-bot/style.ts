import { css } from 'lit';


export const masterStyle = css`
    :host {
        --jina-docbot-color-shadow: #0000000d;
        --jina-docbot-color-background-primary: #fff;
        --jina-docbot-color-border-primary: #f8f9fb;
        --jina-docbot-color-text-primary: #000;

        --jina-docbot-color-background-header: #f8f9fb;
        --jina-docbot-color-border-header: #f8f9fb;


        --jina-docbot-color-text-muted: #646776;
    }

    .jina-doc-bot {
        position: relative;
    }

    .card {
        box-shadow: 0 0.1rem 0.25rem var(--jina-docbot-color-shadow), 0 0 0.0625rem rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        background-clip: border-box;
        background-color: var(--jina-docbot-color-background-primary);
        border: 1px solid var(--jina-docbot-color-border-primary);
        border-radius: 0.25rem;
        color: var(--jina-docbot-color-text-primary);
        display: flex;
        flex-direction: column;
        min-width: 0;
        position: relative;
        word-wrap: break-word;
    }

    .card .card__header {
        padding-right: 3rem;
        user-select: none;

        background-color: var(--jina-docbot-color-background-header);

        border-bottom: 1px solid var(--jina-docbot-color-border-header);

        padding: 1rem;

        font-weight: normal;
    }

    .card .card__header:first-child {
        border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
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
