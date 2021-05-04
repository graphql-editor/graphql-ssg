# GraphQL SSG

[![NPM Version](https://img.shields.io/npm/v/graphql-ssg.svg?style=flat)]()
![Build](https://github.com/graphql-editor/graphql-ssg/actions/workflows/release.yml/badge.svg)

Simple bundler for GraphQL based website using esmodules. What makes it unique? It uses browser for bundling (not node)

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
  "url": "https://faker.graphqleditor.com/explore-projects/feature-mole/graphql",
  "in": "./pages",
  "out": "./out"
}
```

So you need to provide your schema url in and out dirs for graphql-ssg

Watch

```sh
graphql-ssg
```

Build

```sh
graphql-ssg --build
```

### File must contain export default

String returned in contained in file export default is generated via SSG phase.

### Injected built in helper code syntax functions

GraphQL SSG comes with injected functions

#### html

It doesnt transform html in any way, but gives you syntax coloring

```js
const ADiv = html`
  <div>Hello world</div>
`;
```

#### md

It renders markdown using remarkable renderer so it is transformed to html.

```js
const MarkdownContent = md`
# Title of my Story

blah blah blah blah blah blah

## How to read it?
`;
```

## Roadmap

- [ ] Add esbuild
- [ ] Add TS support
- [ ] Add loaders for internal files
- [x] Add intelligent .d.ts autocompletion for imported es modules
- [ ] Add image supports
