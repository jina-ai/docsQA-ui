---
layout: documentations.11ty.cjs
title: <qa-bot> ⌲ Getting started
tags: documentation
name: Getting started
description: Getting started
sort: 0
---
## Importing the qabot
After adding the `<script>` into your web page,
all you need to do is fill in the `server` address. 
Then you are good to go.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"    
></qa-bot>

<script src="https://cdn.jsdelivr.net/npm/qabot"></script>
```
## Setting size and position
`<doc-bot>` is a native `customElement` in modern browsers.
You are free to add any sizing/positioning css to the element.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"    
    style="
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 50vh;
        "
></qa-bot>
```

Note: You might want to specify `max-height` instead of `height` CSS property because `<doc-bot>` comes with a built-in `max-height`.

## Resolving CSS glitches when the page first load
You could get some glitches when the page is first loaded.
This is because `<doc-bot>` is not yet defined when the page first load.

To resolve this issue, you can add a css snippet to make the browser not rendering `<doc-bot>` until it's ready.

```html
<style>
    qa-bot:not(:defined) { display: none; }
</style>
```

Or you can put the `<script>` tag before any `<doc-bot>`, or in the `head` section of your html to force load `<doc-bot>` before the element first rendered.

```html
...
    <script src="https://cdn.jsdelivr.net/npm/qabot"></script>
</head>
```

<style>
    qa-bot:not(:defined) { display: none; }
</style>
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"    
    style="
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 50vh;
        "
    animate-by="position"></qa-bot>
