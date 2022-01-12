---
layout: documentations.11ty.cjs
title: <qa-bot> ⌲ Contributing
tags: documentation
name: Contributing
description: Contributing
sort: 3
---
## Setup development environment
```shell
# In project directory
npm install
```

## Run development server locally
```shell
# In project directory
npm run dev
```

## Customize your development server
You can modify `index.html` to customize the content of development server.

To customize the backend server, you can modify the `server` attribute of `<qa-bot>` element.

```html
<qa-bot 
    server="YOUR OWN BACKEND SERVER HERE (e.g. http://localhost:3001)"
    site="https://docs.jina.ai"
    target="_blank"
></qa-bot>
```

<qa-bot server="https://docsbot.jina.ai" site="https://docs.jina.ai"></qa-bot>

## Run this doc site locally 
```shell
# In project directory
npm run docs:dev
```


<style>
    qa-bot {
        position: fixed; 
        left: 2rem; 
    }
    qa-bot:not(:defined) { display: none; }
</style>
