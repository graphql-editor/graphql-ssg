# GraphQL SSG

[![NPM Version](https://img.shields.io/npm/v/graphql-ssg.svg?style=flat)]()
![Build](https://github.com/graphql-editor/graphql-ssg/actions/workflows/release.yml/badge.svg)

It is the missing ingredient of Web Components architecture. Simple bundler for GraphQL based website using esmodules. What makes it unique? It uses browser for bundling (not node). Remember in ESModules you can use URL imports and relative imports. You can also provide importmap for other imports

## Installation

Install globally

```sh
npm i -g graphql-ssg
```

## How to use

Init a new project. This will create `graphql-ssg.json` in current directory. You don't need a `package.json` but you can add one for type completions.

```sh
graphql-ssg --init .
```

Set up config.

```json
{
  "graphql": {
    "pokemon": {
      "url": "https://graphql-pokemon2.vercel.app/"
    }
  },
  "in": "./pages",
  "out": "./out",
  "websocketPort": 1414,
  "port": 8080
}
```

So you need to provide your schema url ( you can declare multiple schemas ) ,in and out dirs for graphql-ssg

You can also add headers if needed:

```json
{
  "graphql": {
    "pokemon": {
      "url": "https://graphql-pokemon2.vercel.app/",
      "headers": {
        "Authorization": "Bearer MyToken"
      }
    }
  },
  "in": "./pages",
  "out": "./out",
  "websocketPort": 1414,
  "port": 8080
}
```

Watch

```sh
graphql-ssg
```

Build

```sh
graphql-ssg --build
```

## How it works?

### File must contain export default

String returned in contained in file export default is generated via SSG phase.

```js
import { html } from './ssg/basic.js';
export default () => {
  return html`
    <div>Hello world</div>
  `;
};
```

To have syntax coloring in html pleas install appropriate litelement extension for your IDE.

### Config

Config file can be generated or created manually. It should contain all the following values.

```json
{
  "graphql": {
    "feature-mole": {
      "url": "https://faker.graphqleditor.com/explore-projects/feature-mole/graphql"
    }
  },
  "in": "./pages",
  "out": "./out",
  "websocketPort": 1416,
  "port": 8082
}
```

#### Typescript

Turn on typescript support URL imports also works here. Of course you can still import relative modules.

```json
{
  "graphql": {
    "feature-mole": {
      "url": "https://faker.graphqleditor.com/explore-projects/feature-mole/graphql"
    }
  },
  "in": "./pages",
  "out": "./out",
  "websocketPort": 1416,
  "port": 8082,
  "mode": "typescript"
}
```

#### Config Injection

Config file is injected and typed. It is available only inside `export default` and `export const head` function to prevent leaking of secrets.

Usage in JS example:

```js
const graphQLClient = Chain(ssg.config.HOST, {
  headers: {
    Authorization: `Bearer ${ssg.config.TOKEN}`,
  },
});
```

### Environment variables

Environment variables must be put side by side to `graphql-ssg.json` in `.env` file.It is available only inside `export default` and `export const head` .

Usage in JS example:

```js
const graphQLClient = Chain(ssg.env.HOST, {
  headers: {
    Authorization: `Bearer ${ssg.env.TOKEN}`,
  },
});
```

It is available only inside `export default` and `export const head` function to prevent leaking of secrets.

### Injected built in helper code syntax functions

GraphQL SSG comes with generated library

#### Chain

Works like fetch to GraphQL, where you need to provide host and/or options to receive fully Autocompleted client for schema url from your config.

```js
import { Chain } from './ssg/main-schema/index.js';
const graphQLClient = Chain(ssg.config.graphql['main-schema'].url);

const response = await graphQLClient.query({ people: true });
```

#### html

It doesnt transform html in any way, but gives you syntax coloring

```js
import { html } from './ssg/basic.js';
const ADiv = html`
  <div>Hello world</div>
`;
```

#### md

It renders markdown using remarkable renderer so it is transformed to html.

```js
import { md } from './ssg/md.js';
const MarkdownContent = md`
# Title of my Story

blah blah blah blah blah blah

## How to read it?
`;
```

#### head

```js
import { html } from './ssg/basic.js';
export const head = () => html`<title>Hello world!</div>`;
```

## Assets

You can use them as normally.

## Type Streaming

For example: If you use url that begins with `https://cdn.skypack.dev` in your import. It will try to fetch typings from skypack and save them in typings folder referencing to jsconfig. This should provide typings for example in VSCode.

## Roadmap

- [ ] Add esbuild
- [x] Add TS support
- [x] Add intelligent .d.ts autocompletion for imported es modules
- [x] Add image supports
- [x] Generate tsconfig
- [x] Relative imports
- [x] Allow head modification
- [x] Pass env to browser
- [x] Provide a way to inject config
- [x] TSConfig generation for included declarations to work
- [x] Make zeus configurable and importable file
- [ ] Clear error handling with line numbers
- [x] split utility functions css,html,md from zeus
- [x] allow to auto-zeus multiple schemas
- [x] Types from url streaming
