---
layout: page.11ty.cjs
title: <jina-qa-bot> ⌲ Home
---

# &lt;jina-qa-bot&gt;

`<jina-qa-bot>` is the UI part of jina-doc-bot. It's a web component built with [LitElement](https://lit.dev).

## As easy as HTML

<section class="columns">
  <div>

`<jina-qa-bot>` is just an HTML element. You can it anywhere you can use HTML!

```html
<jina-qa-bot></jina-qa-bot>
```

  </div>
<div class="bot-container">
    <jina-qa-bot></jina-qa-bot>
</div>

</section>

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
    <h3>You can tryout QA-bot easily:</h3>
    <p>What is QA-bot?</p>
    <p>Does QA-bot support Vue/React/Angular?</p>
    <p>What are the basic concepts in QA-bot?</p>
</jina-qa-bot>
```

  </div>
  <div class="bot-container">
        <jina-qa-bot label="Try custom title ✨" server="https://docsbot.jina.ai" site="https://docs.jina.ai" target="_blank" open>
           <h3>You can tryout QA-bot easily:</h3>
            <p>What is QA-bot?</p>
            <p>Does QA-bot support Vue/React/Angular?</p>
            <p>What are the basic concepts in QA-bot?</p> 
        </jina-qa-bot>
  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<jina-qa-bot>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

For example, the following Vue code:
```html
<div id="demo-vue">
    <div class="bot-container">
        <jina-qa-bot 
            :open="Number.isInteger(Math.floor(timer / 3) / 2)"
            :theme="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light':'dark'"
            :label="`+${timer}s`" 
            :server="server"
        ></jina-qa-bot>
    </div>
</div>
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
    return tag === 'jina-qa-bot';
};
app.mount('#demo-vue');
```

  </div>
  <div>
Renders to:
<div id="demo-vue">
    <div class="bot-container" v-bind:class="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light' : 'dark'">
        <jina-qa-bot 
            :open="Number.isInteger(Math.floor(timer / 3) / 2)" 
            :label="` +${timer}s`" 
            :server="server"
            :theme="Number.isInteger(Math.floor(timer / 5) / 2) ? 'light':'dark'"
        ></jina-qa-bot>
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
        return tag === 'jina-qa-bot';
    }
    app.mount('#demo-vue');
</script>

  </div>
</section>
