---
layout: documentations.11ty.cjs
title: <qa-bot> ⌲ Theming
tags: documentation
name: Theming
description: Theming
sort: 2
---
## Choose between built-in light/dark themes
`<doc-bot>` have two built-in themes: `light` and `dark`.

By default it will follow the system light/dark preference. This is equivalent to setting `theme="auto"`.

You can specify `theme="light"` or `theme="dark"` to intentionally set the theme.

```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    theme="light"
></qa-bot>
```

## Make your own theme by setting CSS variables
You can create your own theme by overriding the CSS variables.

To do so, override the following CSS variables:

```html
<style>
    qabot[theme="custom"] {
        --qabot-color-shadow: #0000000d;
        --qabot-color-background: #181818;
        --qabot-color-border: #99999940;
        --qabot-color-primary: #ffffff;
        --qabot-color-action: #FBCB67;
        --qabot-color-action-secondary: #fbcb671a;
        --qabot-color-action-contrast: #181818;
        --qabot-color-muted: #81868d;
        --qabot-color-card-header-background: #ffffff1a;
        --qabot-color-card-header-color: #fff;
    }
</style>
```

<qa-bot server="https://jina-ai-jina.docsqa.jina.ai" theme="light" site="https://docs.jina.ai" orientation="bottom-left"></qa-bot>

<style>
    qa-bot {
        position: fixed; 
        left: 2rem;
    }
    qa-bot:not(:defined) { display: none; }
</style>
