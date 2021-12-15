---
layout: page.11ty.cjs
title: <jina-qa-bot> ⌲ Home
---

# &lt;jina-qa-bot>

`<jina-qa-bot>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns" style="height: 30rem;">
  <div>

`<jina-qa-bot>` is just an HTML element. You can it anywhere you can use HTML!

```html
<jina-qa-bot></jina-qa-bot>
```

  </div>
  <div style="width: 100%; height: 100%; background: black; position: relative;">

<jina-qa-bot server="https://docsbot.jina.ai" site="https://docs.jina.ai" target="_blank" style="">
    <h3>You can ask questions about Jina. Try:</h3>
    <p>What is Jina?</p>
    <p>Does Jina support Kubernetes?</p>
    <p>How can I traverse a nested DocumentArray?</p>
    <p>What are the basic concepts in Jina?</p>
</jina-qa-bot>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<jina-qa-bot>` can be configured with attributed in plain HTML.

```html
<jina-qa-bot name="HTML"></jina-qa-bot>
```

  </div>
  <div>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<jina-qa-bot>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;jina-qa-bot&gt;</h2>
    <jina-qa-bot .name=${name}></jina-qa-bot>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;jina-qa-bot&gt;</h2>

  </div>
</section>
