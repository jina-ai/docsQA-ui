---
layout: documents.11ty.cjs
title: <jina-qa-bot> ⌲ Getting started
tags: documents
name: Getting started
description: Getting started
---
## Importing the jina-qa-bot

After adding the `<script>` into your web page,
all you need to do is fill in the `server` address. 
And we are good to go.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
></jina-qa-bot>

<script src="https://unpkg.com/@jina-ai/jina-qa-bot"></script>
```

## Setting size and position
`<jina-doc-bot>` is an native `customElement` to modern browsers.
You are free to add any sizing/positioning css to the element.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="position: fixed; width: 26em; max-height: 50vh;"
></jina-qa-bot>
```

Note: You might want to specify `max-height` instead of `height` CSS property because `<jina-doc-bot>` comes with a built-in `max-height`.

<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="position: fixed; width: 26em; max-height: 50vh;"></jina-qa-bot>
