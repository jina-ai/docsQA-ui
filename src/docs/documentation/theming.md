---
layout: documentations.11ty.cjs
title: <jina-qa-bot> ⌲ Theming
tags: documentation
name: Theming
description: Theming
sort: 2
---
## Choose between built-in light/dark themes
`<jina-doc-bot>` have two built-in themes: `light` and `dark`.

By default it will follow the system light/dark preference. This is equivalent to setting `theme="auto"`.

You can specify `theme="light"` or `theme="dark"` to intentionally set the theme.

```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    theme="light"
></jina-qa-bot>
```

## Make your own theme by setting CSS variables
You can create your own theme by overriding the CSS variables.

To do so, override the following CSS variables:

```html
<style>
    jina-qa-bot[theme="custom"] {
        --jina-qabot-color-shadow: #0000000d;
        --jina-qabot-color-background: #fff;
        --jina-qabot-color-padding: #f8f9fb;
        --jina-qabot-color-primary: #000;
        --jina-qabot-color-action: #009191;
        --jina-qabot-color-action-contrast: #fff;
        --jina-qabot-color-dimmed: #eeebee;
        --jina-qabot-color-muted: #646776;
    }
</style>
```

<jina-qa-bot server="https://docsbot.jina.ai" theme="light" site="https://docs.jina.ai"></jina-qa-bot>

<style>
    jina-qa-bot {
        position: fixed; 
        left: 2rem; 
    }
    jina-qa-bot:not(:defined) { display: none; }
</style>
