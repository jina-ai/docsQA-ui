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
    server="https://jina-ai-jina-docsqa.jina.ai" 
    open
    site="https://docs.jina.ai" 
    target="_blank"
    bot-avatar="https://jina.ai/assets/images/logo.svg"
    greeting="You can tryout qabot easily:"
    questions='["What is Jina1?","Does Jina support Kubernetes?2","How can I traverse a nested DocumentArray?3"]'
    header-style='{"color": "red", "background": "white center/100% no-repeat url(https://jina.ai/assets/images/backgrounds/finetuner.png)"}'
    >
</qa-bot>
```
## Install

`<qa-bot>` is distributed on npm, so you can install it locally or use it via npm CDNs like jsdelivr.

```html
<script src="https://cdn.jsdelivr.net/npm/qabot"></script>
```
