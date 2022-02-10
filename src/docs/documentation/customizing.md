---
layout: documentations.11ty.cjs
title: <qa-bot> ⌲ Customizing
tags: documentation
name: Customizing
description: Customizing
sort: 1
---
## Setting the title text
`<qa-bot>` comes with a default title `Ask our docs!`. To customize this text, set the `label` attribute.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    label="Custom title ✨"
></qa-bot>
```
## Setting reference link base URL
QA answers of `<qa-bot>` will give you a reference link to the original source.
You can customize the base URL of the reference link by setting the `site` attribute. 
If left blank, the reference links will be treated relative to current location. 
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    site="https://docs.jina.ai"
></qa-bot>
```

## Setting reference link target
By default the reference links open to `_self`. You can override this behavior by setting the `target` attribute. Just like a normal `<a>` tag.

For example `target="_blank"` will open the reference links in a new tab.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    site="https://docs.jina.ai"
    target="_blank"
></qa-bot>
```

## Make chat box open by default
By default the chat box is collapsed after load. If you want it to be open by default, set the `open` attribute.

```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    site="https://docs.jina.ai"
    open
></qa-bot>
```

## Customizing intro headline and sample questions
When you open the `<doc-bot>`, you will find a short intro headline and a set of sample questions.
These were intended to be customized by the users to fit their own needs.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"    
    style="position: fixed; width: 26em; max-height: 20rem;"
>
    <dt>You can tryout qabot easily:</dt>
    <dd>What is qabot?</dd>
    <dd>Does qabot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in qabot?</dd>
</qa-bot>
```
Note that although `<doc-bot>` comes with some simple styling for slotted elements, It's up to the users to style them as expected.

```html
<qa-bot server="https://jina-ai-jina-docsqa.jina.ai">
    <dt>You can tryout qabot easily:</dt>
    <dd>What is qabot?</dd>
    <dd>Does qabot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in qabot?</dd>
</qa-bot>
<style>
    qa-bot dt {
        font-size: 1.25rem;
        color: cyan;
    }
    qa-bot {
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 20rem;
    }
    qa-bot:not(:defined) { display: none; }
</style>
```
## Choose animation implementation
By default the slide-up/slide-down animation is implemented by transitioning `max-height` of the element.

If you intend to have `<doc-bot>` fixed at the bottom of the page, you can set `animate-by="position"` to use animation transitioning `transform: translateY`.

```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    site="https://docs.jina.ai"
    animate-by="position"
></qa-bot>
```

<qa-bot server="https://jina-ai-jina-docsqa.jina.ai" label="Ask me about Jina ✨" site="https://docs.jina.ai" open animate-by="position">
    <dt>You can tryout qabot easily:</dt>
    <dd>What is qabot?</dd>
    <dd>Does qabot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in qabot?</dd>
</qa-bot>

<style>
    qa-bot dt {
        font-size: 1.25rem;
        color: cyan;
    }
    qa-bot {
        position: fixed; 
        left: 2rem; 
        width: 18rem; 
        max-height: 20rem;
    }
    qa-bot:not(:defined) { display: none; }
</style>
