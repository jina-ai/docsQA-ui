---
layout: page.11ty.cjs
title: <qa-bot> ⌲ Integration
---

## Install
Install `<qa-bot>` via npm or CDN, see [details](/install/).

## Configuration

### Name
By default the name is `DocsQA`, shown in qa bot header, you can input some text to override it.

### Description
By default the description is `@Jina AI`, shown in qa bot header, you can input some text to override it.

### Server(Required)
Select/Input one server address(you can index the docs by [api](https://github.com/jina-ai/docsQA/tree/main/service), once it is done, you can get an server url from your email). The list is including all projects which are ready to use `<qa-bot>`. 

### Token
Once you select/input a server, the related token will be generated and shown in the code snippet, prevent exposing server url directly.

### Site
QA answers of `<qa-bot>` will give you a reference link to the original source.
You can customize the base URL of the reference link by inputting a url. 
If left blank, the reference links will be treated relative to current location. 

### Avatar Url
You can override the avatar by inputting an image url.

### Header Background Url
If you want to use an image as the header background, could set it by inputting the image url.

### Theme
By default it will refer the system theme color.
You can select `light` or `dark` to intentionally set the theme, but `refer` is suggested, which help to keep the same style with the website.

### Color
Only be configurable when `theme="refer"`. By default it will refer to the system theme color, you can override it by selecting new color.

### Background Color
Only be configurable when `theme="refer"`. By default it will refer to the system theme bg color, if no theme bg color, will use the background color of its parent element, if the bg color is white or transparent, will continue checking the elements upwards until `body`. you can override it by selecting new color.

### Orientation
By default `<doc-bot>` is fixed at bottom-right, if you intend to have it fixed at the left bottom of the page, you can select `bottom-top` to decide the animation origin, the supported values: `bottom-left`, `bottom-right`, `top-left`, `top-right` and `center`.

### Open
By default the chat box is collapsed after load. If you want it to be open by default, check the `yes` option.

### Show tip
By default the chat box is badge only. If you want add a tip beside it, check the `yes` option.

### Tip text
By default the tip text is "Hi there 👋 Ask our docs!". If you want override it, input some new text.

### Unknown Answer
By default the unknown answer message is "😵‍💫 I'm sorry but I don't know the answer.". If you want to override it, input the new text, and you can also add a URL to link the user to one specific page, like GitHub issue page.

### Target
By default the reference links open to `_self`. You can override this behavior by selecting other options.
Just like a normal `<a>` tag, for example `target="_blank"` will open the reference links in a new tab.

### Greeting
When you open the `<doc-bot>`, you will find a short intro headline and a set of sample questions.
These were intended to be customized by the users to fit their own needs.

### Preview & Code
After the configuration is finished, you could preview the qabot on right section, and go to code tab you see the related code snippet

### Integration
Copy the code snippet and insert to your website html body. Congratulations, you have completed the integration now!
For most docs projects, you could add the code snippet to `_template/page.html`.


<section id="configuration">
    <div id="vue-app" class="columns">
        <div class="config-form">
            <div class="config-form-item">
                <label>Name</label><input v-model="model.name"/>
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
            <div class="config-form-item multi-rows">
                <label>Unknown Answer</label>
                <div class="inline-block">
                <label class="inner-label">Text</label>
                <input v-model="model.unknownAnswer.text" @change="onUpdate('text', true)" placeholder="Set message for unknown answer" /><br />
                <label class="inner-label">URL</label>
                <input v-model="model.unknownAnswer.url" @change="onUpdate('text', true)" placeholder="The url where to report the issue, like Github issue url/slack url" />
                </div>
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
                        <span slot="texts">
                            <span for="tip" :textContent="model.tipText">{{model.tipText}}</span>
                            <span for="unknownAnswerText" :textContent="model.unknownAnswer.text">{{model.unknownAnswer.text}}</span>
                            <span for="unknownAnswerUrl" :textContent="model.unknownAnswer.url">{{model.unknownAnswer.url}}</span>
                        </span>
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
                        unknownAnswer: {
                            text: '',
                            url: ''
                        },
                        target: undefined,
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
                    const template = `\n <template>${this.model.greeting.title || this.model.greeting.questions ? `\n  <dl>\n   <dt>${this.model.greeting.title}</dt>${this.questions.map(item => `\n   <dd>${item}</dd>`).join('')}\n  </dl>` : ''}\n </template>`;
                    const textsTemplate = `\n <template slot="texts">${this.model.showTip ? `\n   <span for="tip">${this.model.tipText}</span>` : ''}${this.model.unknownAnswer.text ? `\n   <span for="unknownAnswerText">${this.model.unknownAnswer.text}</span>` : ''}${this.model.unknownAnswer.url ? `\n   <span for="unknownAnswerUrl">${this.model.unknownAnswer.url}</span>` : ''}\n </template>`;
                    this.source = `<qa-bot${this.model.token ? `\ntoken="${this.model.token}"` : ''}${this.model.avatarUrl ? `\navatar-src="${this.model.avatarUrl}"` : ''}${this.model.bgImageUrl ? `\nheader-background-src="${this.model.bgImageUrl}"` : ''}${this.model.bgColor ? `\nbg-color="${this.model.bgColor}"` : ''}${this.model.fgColor ? `\nfg-color="${this.model.fgColor}"` : ''}${this.model.theme ? `\ntheme="${this.model.theme}"` : ''}${this.model.site ? `\nsite="${this.model.site}"` : ''}${this.model.target ? `\ntarget="${this.model.target}"` : ''}${this.model.orientation ? `\norientation="${this.model.orientation}"` : ''}${this.model.name ? `\ntitle="${this.model.name}"` : ''}${this.model.description ? `\ndescription="${this.model.description}"` : ''}${this.model.open ? '\nopen' : ''} ${this.model.showTip ? '\nshow-tip' : ''}>${this.model.greeting.title || this.model.greeting.questions ? template : ''}${this.model.tipText || this.model.unknownAnswer.text || this.model.unknownAnswer.url ? textsTemplate: ''}\n</qa-bot>`;
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
