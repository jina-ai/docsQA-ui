---
layout: documents.11ty.cjs
title: <jina-qa-bot> ⌲ Customizing
tags: documents
name: Customizing
description: Customizing
---

## Customizing the title text
`<jina-doc-bot>` comes with a default title `Ask our docs!`. To customize this text, set the `label` attribute.

## Customizing intro headline and sample questions
When you open the `<jina-doc-bot>`, you will find a short intro headline and a set of sample questions.
These were intended to be customized by the users to fit their own needs.
```html
<jina-qa-bot
    server="https://docsbot.jina.ai"    
    style="position: fixed; width: 26em; max-height: 50vh;"
>
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
```
Note that although `<jina-doc-bot>` comes with some simple styling for slotted elements, It's up to the users to style them as expected.

```html
<style>
    jina-qa-bot h3 {
        font-size: 1.25rem;
        color: cyan;
    }
    jina-qa-bot {
        position: fixed; 
        width: 26em; 
        max-height: 50vh;
    }
</style>
<jina-qa-bot server="https://docsbot.jina.ai">
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
```
<style>
    jina-qa-bot h3 {
        font-size: 1.25rem;
        color: cyan;
    }
    jina-qa-bot {
        position: fixed; 
        width: 26em; 
        max-height: 50vh;
    }
</style>
<jina-qa-bot server="https://docsbot.jina.ai">
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
