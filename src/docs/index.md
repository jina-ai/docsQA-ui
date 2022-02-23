---
layout: page.11ty.cjs
title: <qa-bot> ⌲ Home
---

# &lt;qa-bot&gt;

`<qa-bot>` is the UI part of DocsQA. It's a web component built with [Lit](https://lit.dev).
```html
<script src="https://cdn.jsdelivr.net/npm/qabot"></script>
```

## As easy as HTML

<section class="columns">
  <div>

`<qa-bot>` is just an HTML element. You can it anywhere you can use HTML!

```html
<qa-bot></qa-bot>
```

  </div>
<div class="bot-container">
    <qa-bot></qa-bot>
</div>

</section>

## Configure with attributes

<section class="columns">
  <div>

`<qa-bot>` can be configured with attributes in plain HTML.

```html
<qa-bot 
    label="Try custom title ✨"
    server="https://jina-ai-jina.docsqa.jina.ai" 
    open
    site="https://docs.jina.ai" 
    target="_blank">
    <dl>
        <dt>You can tryout qabot easily:</dt>
        <dd>What is qabot?</dd>
        <dd>Does qabot support Vue/React/Angular?</dd>
        <dd>What are the basic concepts in qabot?</dd>
    </dl>
</qa-bot>
```

  </div>
  <div class="bot-container">
        <qa-bot label="Try custom title ✨" server="https://jina-ai-jina.docsqa.jina.ai" site="https://docs.jina.ai" target="_blank" open>
            <dl>
                <dt>You can tryout qabot easily:</dt>
                <dd>What is qabot?</dd>
                <dd>Does qabot support Vue/React/Angular?</dd>
                <dd>What are the basic concepts in qabot?</dd>
            </dl>
        </qa-bot>
  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<qa-bot>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

For example, the following Vue code:
```html
<div id="demo-vue">
    <div class="bot-container">
        <qa-bot 
            :open="Number.isInteger(Math.floor(timer / 3) / 2)"
            :theme="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light':'dark'"
            :title="`+${timer}s`" 
            :server="server"
        ></qa-bot>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@next"></script>
```

```js
const app = Vue.createApp({ 
    data() {
        return { 
            server: '/', 
            timer: 0 
        };
    },
    created() {
        setInterval(()=> {
            this.timer += 1;
        }, 1000);
    }
});
app.config.compilerOptions.isCustomElement = (tag)=> {
    return tag === 'qa-bot';
};
app.mount('#demo-vue');
```

  </div>
  <div>
Renders to:
<div id="demo-vue">
    <div class="bot-container" v-bind:class="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light' : 'dark'">
        <qa-bot 
            :open="Number.isInteger(Math.floor(timer / 3) / 2)" 
            :title="` +${timer}s`" 
            :server="server"
            :theme="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light':'dark'"
        ></qa-bot>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@next"></script>
<script type="text/javascript">
    const app = Vue.createApp({ 
        data() {
            return { server: 'baidu.com', timer: 0 };
        },
        created() {
            setInterval(()=> {
                this.timer += 1;
            }, 1000);
        }
    });
    app.config.compilerOptions.isCustomElement = (tag)=> {
        return tag === 'qa-bot';
    }
    app.mount('#demo-vue');
</script>

  </div>
</section>

<style>
    qa-bot {
        right: 2rem;
    }
</style>
