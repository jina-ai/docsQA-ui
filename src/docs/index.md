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
        <dd>What is Jina?</dd>
        <dd>Does Jina support Kubernetes?</dd>
        <dd>What are the basic concepts in Jina?</dd>
    </dl>
</qa-bot>
```

  </div>
  <div class="bot-container">
        <qa-bot label="Try custom title ✨" server="https://jina-ai-jina.docsqa.jina.ai" site="https://docs.jina.ai" target="_blank" open>
            <dl>
                <dt>You can tryout qabot easily:</dt>
                <dd>What is Jina?</dd>
                <dd>Does Jina support Kubernetes?</dd>
                <dd>What are the basic concepts in Jina?</dd>
            </dl>
        </qa-bot>
  </div>
</section>

## Configuration UI

<section id="configuration">
    <div id="vue-app" class="columns">
        <div class="config-form">
            <div class="config-form-item">
                <label>Name</label><input v-model="model.name" />
            </div>
            <div class="config-form-item">
                <label>Description</label><input v-model="model.description" @input="onUpdate('text')" />
            </div>
            <div class="config-form-item">
                <label>Server</label>
                <input list="projects" v-model="model.server" @change="onUpdate('server')" />
                <datalist id="projects">
                    <option v-for="item in projects" :value="item">
                </datalist>
            </div>
            <div class="config-form-item">
                <label>Token</label>
                <input v-model="model.token" @change="onUpdate('token')" />
            </div>
             <div class="config-form-item">
                <label>Site</label>
                <input v-model="model.site" />
            </div>
            <div class="config-form-item">
                <label>Avatar Url</label><input type="url" v-model="model.avatarUrl" />
            </div>
            <div class="config-form-item">
                <label>Header Background Url</label><input type="url" v-model="model.bgImageUrl" />
            </div>
            <div class="config-form-item">
                <label>Theme</label>
                <select v-model="model.theme">
                <option v-for="item in themes" :key="item" :label="item" :value="item">{{item}}</option>
                </select>
            </div>
            <div v-if="model.theme === 'infer'" class="config-form-item">
                <label>Color</label><input v-model="model.fgColor" data-coloris @change="onUpdate('color')"/>
            </div>
            <div v-if="model.theme === 'infer'" class="config-form-item">
                <label>Background Color</label><input v-model="model.bgColor" data-coloris @change="onUpdate('color')"/>
            </div>
            <div class="config-form-item">
                <label>Orientation</label>
                <select v-model="model.orientation">
                <option v-for="item in orientations" :key="item.key" :label="item.value" :value="item.key">{{item.value}}</option>
                </select>
            </div>
            <div class="config-form-item">
                <label>Open</label>
                <input class="radio-btn" type="radio" :value="true" name="open" v-model="model.open" /><span class="radio-label">Yes</span>
                <input class="radio-btn" type="radio" :value="undefined" name="open" v-model="model.open" /><span class="radio-label">No</span>
            </div>
            <div class="config-form-item">
                <label>Show Tip</label>
                <input class="radio-btn" type="radio" :value="true" name="tip" v-model="model.showTip" /><span class="radio-label">Yes</span>
                <input class="radio-btn" type="radio" :value="undefined" name="tip" v-model="model.showTip" /><span class="radio-label">No</span>
            </div>
            <div v-if="model.showTip" class="config-form-item">
                <label>Tip Text</label><textarea v-model="model.tipText" rows="3" placeholder="Hi there 👋&#10;Ask our docs!" @change="onUpdate('text', true)"></textarea>
            </div>
            <div class="config-form-item">
                <label>Target</label>
                <select v-model="model.target">
                <option v-for="item in targets" :key="item" :label="item" :value="item">{{item}}</option>
                </select>
            </div>
            <div class="config-form-item multi-rows">
                <label>Greeting</label>
                <div class="inline-block">
                <label class="inner-label">Title</label>
                <input v-model="model.greeting.title" @change="onUpdate('text', true)" placeholder="You can tryout qabot easily:" /><br />
                <label class="inner-label">Questions</label>
                <textarea rows="5" v-model="model.greeting.questions" @change="onUpdate('text', true)" placeholder="What is Jina?&#10;Does Jina support Kubernetes?&#10;What are the basic concepts in Jina?"></textarea>
                </div>
            </div>
        </div>
        <div class="config-preview">
            <nav class="tabs">
                <button :class="['tab-item', activeTab === 'preview' ? 'active' : '']" title="preview" @click="onClickTab('preview')">Preview</button>
                <button :class="['tab-item', activeTab === 'source' ? 'active' : '']" title="source" @click="onClickTab('source')">Code</button>
            </nav>
            <div id="preview" class="qa-bot-container" v-show="activeTab === 'preview'">
                <qa-bot
                :token="model.token"
                :server="model.server"
                :avatar-src="model.avatarUrl"
                :header-background-src="model.bgImageUrl"
                :bg-color="model.bgColor"
                :fg-color="model.fgColor"
                :theme="model.theme"
                :site="model.site"
                :target="model.target"
                :orientation="model.orientation"
                :title="model.name"
                :description="model.description"
                :show-tip="model.showTip"
                :open="model.open">
                        <dl slot="greetings" v-if="model.greeting.title || model.greeting.questions">
                            <dt :textContent="model.greeting.title">{{model.greeting.title}}</dt>
                            <dd v-for="(question, index) in questions" :key="'q_' + index" :textContent="question">{{question}}</dd>
                        </dl>
                        <span slot="texts" for="tip" :textContent="model.tipText">{{model.tipText}}</span>
                </qa-bot>
            </div>
            <div id="source" class="source-container" v-show="activeTab === 'source'">
                <div class="btn-container">
                    <button class="action-btn" title="copy" @click="onCopy">Copy to clipboard</button>
                    <button class="action-btn" title="refresh" @click="onRefresh">Refresh</button>
                </div>
                <textarea id="CODE" readonly v-model="source">
                </textarea>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@next"></script>
    <script src="https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js"></script>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', () => {
            window.qabot = document.querySelector('#preview qa-bot');
        });
        const app = Vue.createApp({
            data() {
                return {
                    model: {
                        name: 'DocsQA',
                        description: '@Jina AI',
                        token: undefined,
                        server: undefined,
                        site: undefined,
                        avatarUrl: undefined,
                        bgImageUrl: undefined,
                        fgColor: undefined,
                        bgColor: undefined,
                        theme: 'infer',
                        orientation: 'bottom-right',
                        open: undefined,
                        showTip: undefined,
                        tipText: '',
                        target: '_blank',
                        greetingTitle: 'Welcome to DocsQA! Please ask any question:',
                        greeting: {
                            title: '',
                            questions: ''
                        }
                    },
                    orientations: [
                        { key: 'bottom-right', value: 'Bottom-Right' },
                        { key: 'bottom-left', value: 'Bottom-Left' },
                        { key: 'top-right', value: 'Top-Right' },
                        { key: 'top-left', value: 'Top-Left' },
                        { key: 'center', value: 'Center' }
                    ],
                    themes: ['light', 'dark', 'auto', 'infer'],
                    targets: ['_blank', '_self', '_parent', '_top'],
                    source: '',
                    activeTab: 'preview',
                    projects: []
                }
            },
            computed: {
                questions () {
                    return this.model.greeting.questions ? this.model.greeting.questions.split('\n') : [];
                }
            },
            created() {
                const http = new XMLHttpRequest();
                http.responseType = 'json';
                http.onreadystatechange = () => {
                    if (http.readyState === 4 && http.status === 200) {
                        const result = http.response;
                        this.projects = result.map((item) => item.host);
                    }
                }
                http.open('GET', 'https://apidocsqa.jina.ai/projects');
                http.send();
            },
            methods: {
                onClickTab(tabName) {
                    this.activeTab = tabName;
                    if (tabName === 'source') {
                        this.onRefresh();
                    }
                },
                insertInnerText() {
                    if (window.qabot) {
                        const slots = window.qabot.querySelectorAll('[textContent]');
                        slots.forEach((slot) => {
                            slot.innerHTML = slot.getAttribute('textContent');
                            slot.removeAttribute('textContent');
                        })
                    }
                },
                onUpdate(type, isSlot = false) {
                    switch (type) {
                        case 'text':
                            if (isSlot) {
                                this.insertInnerText();
                            }
                             window.qabot.loadPreferences();
                            break;
                        case 'color':
                            window.qabot.inferTheme();
                            break;
                        case 'server':
                            if (this.model.server) {
                                this.model.token = window.qabot.xorEncryptStringUtf8B64(this.model.server);
                            }
                            break;
                        case 'token':
                            if (this.model.token) {
                                this.model.server = window.qabot.xorDecryptB64EncodedUtf8(this.model.token);
                            }
                            break;
                    }
                    window.qabot.requestUpdate();
                },
                onCopy() {
                    const copyText = document.getElementById('CODE');
                    copyText.select();
                    copyText.setSelectionRange(0, 99999);
                    navigator.clipboard.writeText(copyText.value);
                },
                onRefresh() {
                    const template = ` <template>\n  <dl>\n   <dt>${this.model.greeting.title}</dt>${this.questions.map(item => `\n   <dd>${item}</dd>`).join('')}\n  </dl>${this.model.showTip ? `\n   <span slot="texts" for="tip">${this.model.tipText}</span>` : ''}\n </template>`;
                    this.source = `<qa-bot${this.model.token ? `\ntoken="${this.model.token}"` : ''}${this.model.avatarUrl ? `\navatar-src="${this.model.avatarUrl}"` : ''}${this.model.bgImageUrl ? `\nheader-background-src="${this.model.bgImageUrl}"` : ''}${this.model.bgColor ? `\nbg-color="${this.model.bgColor}"` : ''}${this.model.fgColor ? `\nfg-color="${this.model.fgColor}"` : ''}${this.model.theme ? `\ntheme="${this.model.theme}"` : ''}${this.model.site ? `\nsite="${this.model.site}"` : ''}${this.model.target ? `\ntarget="${this.model.target}"` : ''}${this.model.orientation ? `\norientation="${this.model.orientation}"` : ''}${this.model.name ? `\ntitle="${this.model.name}"` : ''}${this.model.description ? `\ndescription="${this.model.description}"` : ''}${this.model.open ? '\nopen' : ''} ${this.model.showTip ? '\nshow-tip' : ''}>\n${this.model.greeting.title || this.model.greeting.questions || this.model.tipText ? template : ''}\n</qa-bot>`;
                }
            },
        });
        app.config.compilerOptions.isCustomElement = (tag)=> {
            return tag === 'qa-bot';
        };
        app.mount('#vue-app');
    </script>
</section>

<style>
    qa-bot {
        right: 2rem;
    }
</style>
