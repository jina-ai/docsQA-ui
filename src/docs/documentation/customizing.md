---
layout: documentations.11ty.cjs
title: <qa-bot> ⌲ Customizing
tags: documentation
name: Customizing
description: Customizing
sort: 1
---
## Setting the chat bot name
`<qa-bot>` comes with a default title `DocsQA`. To customize this text, add slot with name "name".
```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
>
<span slot="name"></span>
</qa-bot>
```
## Setting the chat bot description
`<qa-bot>` comes with a default title `@Jina AI`. To customize this text, add slot with name "description".
```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
>
<span slot="description">@Company</span>
</qa-bot>
```
## Setting reference link base URL
QA answers of `<qa-bot>` will give you a reference link to the original source.
You can customize the base URL of the reference link by setting the `site` attribute. 
If left blank, the reference links will be treated relative to current location. 
```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    site="https://docs.jina.ai"
></qa-bot>
```

## Setting reference link target
By default the reference links open to `_self`. You can override this behavior by setting the `target` attribute. Just like a normal `<a>` tag.

For example `target="_blank"` will open the reference links in a new tab.
```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    site="https://docs.jina.ai"
    target="_blank"
></qa-bot>
```

## Make chat box open by default
By default the chat box is collapsed after load. If you want it to be open by default, set the `open` attribute.

```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    site="https://docs.jina.ai"
    open
></qa-bot>
```

## Setting chat bot header background
By default the background of the chat box header is primary color(light mode). If you want to add an image as the background, set the `header-background` attribute.
```html
<qa-bot
    server="https://jina-ai-jina-docsqa.jina.ai"
    header-background-src="https://jina.ai/assets/images/backgrounds/docarray.png"
></qa-bot>
```

## Customizing intro headline and sample questions
When you open the `<doc-bot>`, you will find a short intro headline and a set of sample questions.
These were intended to be customized by the users to fit their own needs.
```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"    
    style="position: fixed; width: 26em; max-height: 20rem;"
>
  <dl>
    <dt>You can tryout qabot easily:</dt>
    <dd>What is qabot?</dd>
    <dd>Does qabot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in qabot?</dd>
  </dl>
</qa-bot>
```
## Choose animation implementation
By default the slide-up/slide-down animation is implemented by transitioning `max-height` of the element.

If you intend to have `<doc-bot>` fixed at the left bottom of the page, you can set `orientation="bottom-top"` to decide the animation origin, the supported values: `bottom-left`, `bottom-right`, `top-left`, `top-right` and `center`.

```html
<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    site="https://docs.jina.ai"
    orientation="bottom-left"
></qa-bot>
```

<qa-bot
    server="https://jina-ai-jina.docsqa.jina.ai"
    site="https://docs.jina.ai"
    open
    orientation="bottom-left"  
    header-background="https://jina.ai/assets/images/backgrounds/docarray.png">
</qa-bot>

<style>
    qa-bot dt {
        font-size: 1.25rem;
        color: cyan;
    }
    qa-bot {
        position: fixed; 
        left: 2rem; 
        width: 22rem; 
        max-height: 30rem;
    }
    qa-bot:not(:defined) { display: none; }
</style>
