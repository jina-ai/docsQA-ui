# &lt;qa-bot&gt;

`<qa-bot>` is the UI part of DocQA. It's a web component built with [Lit](https://lit.dev).

`<qa-bot>` is just a HTML element. You can have it anywhere you can use HTML!
```html
<qa-bot></qa-bot>
```

## Configure with attributes

<section class="columns">
  <div>

`<qa-bot>` can be configured with attributes in plain HTML.

```html
<qa-bot 
    label="Try custom title ✨"
    server="https://docsbot.jina.ai" 
    open
    site="https://docs.jina.ai" 
    target="_blank">
    <dt>You can tryout qabot easily:</dt>
    <dd>What is qabot?</dd>
    <dd>Does qabot support Vue/React/Angular?</dd>
    <dd>What are the basic concepts in qabot?</dd>
</qa-bot>
```
## Install

`<qa-bot>` is distributed on npm, so you can install it locally or use it via npm CDNs like jsdelivr.

```html
<script src="https://cdn.jsdelivr.net/npm/qabot"></script>
```
