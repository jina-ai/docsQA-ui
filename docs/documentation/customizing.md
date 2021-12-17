---
layout: documentations.11ty.cjs
title: <jina-qa-bot> ⌲ Customizing
tags: documentation
name: Customizing
description: Customizing
sort: 1
---
## Setting the title text
`<jina-doc-bot>` comes with a default title `Ask our docs!`. To customize this text, set the `label` attribute.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    label="Custom title ✨"
></jina-qa-bot>
```
## Setting reference link base URL
QA answers of `<jina-doc-bot>` will give you a reference link to the original source.
You can customize the base URL of the reference link by setting the `site` attribute. 
If left blank, the reference links will be treated relative to current location. 
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    site="https://docs.jina.ai"
></jina-qa-bot>
```

## Setting reference link target
By default the reference links open to `_self`. You can override this behavior by setting the `target` attribute. Just like a normal `<a>` tag.

For example `target="_blank"` will open the reference links in a new tab.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    site="https://docs.jina.ai"
    target="_blank"
></jina-qa-bot>
```

## Make chat box open by default
By default the chat box is collapsed after load. If you want it to be open by default, set the `open` attribute.

```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    site="https://docs.jina.ai"
    open
></jina-qa-bot>
```

## Customizing intro headline and sample questions
When you open the `<jina-doc-bot>`, you will find a short intro headline and a set of sample questions.
These were intended to be customized by the users to fit their own needs.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="position: fixed; width: 26em; max-height: 20rem;"
>
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
```
Note that although `<jina-doc-bot>` comes with some simple styling for slotted elements, It's up to the users to style them as expected.

```html
<jina-qa-bot server="https://docsbot.jina.ai">
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
<style>
    jina-qa-bot h3 {
        font-size: 1.25rem;
        color: cyan;
    }
    jina-qa-bot {
        position: fixed; 
        left: 2rem; 
        right: unset; 
        width: 18rem; 
        max-height: 20rem;
    }
    jina-qa-bot:not(:defined) { display: none; }
</style>
```
## Choose animation implementation
By default the slide-up/slide-down animation is implemented by transitioning `max-height` of the element.

If you intend to have `<jina-doc-bot>` fixed at the bottom of the page, you can set `animate-by="position"` to use animation transitioning `transform: translateY`.

```html
<jina-qa-bot
    server="https://docsbot.jina.ai"
    site="https://docs.jina.ai"
    animate-by="position"
></jina-qa-bot>
```

<jina-qa-bot server="https://docsbot.jina.ai" label="Ask me about Jina ✨" site="https://docs.jina.ai" open animate-by="position">
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>

<style>
    jina-qa-bot h3 {
        font-size: 1.25rem;
        color: cyan;
    }
    jina-qa-bot {
        position: fixed; 
        left: 2rem; 
        right: unset; 
        width: 18rem; 
        max-height: 20rem;
    }
    jina-qa-bot:not(:defined) { display: none; }
</style>
