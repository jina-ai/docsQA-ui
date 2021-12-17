---
layout: documentations.11ty.cjs
title: <jina-qa-bot> ⌲ Getting started
tags: documentation
name: Getting started
description: Getting started
sort: 0
---
## Importing the jina-qa-bot
After adding the `<script>` into your web page,
all you need to do is fill in the `server` address. 
Then you are good to go.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
></jina-qa-bot>

<script src="https://cdn.jsdelivr.net/npm/@jina-ai/jina-qa-bot"></script>
```
## Setting size and position
`<jina-doc-bot>` is an native `customElement` in modern browsers.
You are free to add any sizing/positioning css to the element.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 50vh;
        "
></jina-qa-bot>
```

Note: You might want to specify `max-height` instead of `height` CSS property because `<jina-doc-bot>` comes with a built-in `max-height`.

## Resolving CSS glitches when the page first load
You could get some glitches when the page is first loaded.
This is because `<jina-doc-bot>` is not yet defined when the page first load.

To resolve this issue, you can add a css snippet to make the browser not rendering `<jina-doc-bot>` until it's ready.

```html
<style>
    jina-qa-bot:not(:defined) { display: none; }
</style>
```

Or you can put the `<script>` tag before any `<jina-doc-bot>`, or in the `head` section of your html to force load `<jina-doc-bot>` before the element first rendered.

```html
...
    <script src="https://cdn.jsdelivr.net/npm/@jina-ai/jina-qa-bot"></script>
</head>
```

<style>
    jina-qa-bot:not(:defined) { display: none; }
</style>
<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 50vh;
        "
    animate-by="position"></jina-qa-bot>
