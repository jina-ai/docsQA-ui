# &lt;jina-qa-bot&gt;

`<jina-qa-bot>` is the UI part of jina-doc-bot. It's a web component built with [LitElement](https://lit.dev).

`<jina-qa-bot>` is just an HTML element. You can it anywhere you can use HTML!
```html
<jina-qa-bot></jina-qa-bot>
```

## Configure with attributes

<section class="columns">
  <div>

`<jina-qa-bot>` can be configured with attributed in plain HTML.

```html
<jina-qa-bot 
    label="Try custom title ✨"
    server="https://docsbot.jina.ai" 
    open
    site="https://docs.jina.ai" 
    target="_blank">
    <dt>You can tryout QA-bot easily:</dt>
    <dd>What is QA-bot?</dd>
    <dd>Does QA-bot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in QA-bot?</dd>
</jina-qa-bot>
```
## Install

`<jina-qa-bot>` is distributed on npm, so you can install it locally or use it via npm CDNs like jsdelivr.

```html
<script src="https://cdn.jsdelivr.net/npm/@jina-ai/jina-qa-bot"></script>
```
