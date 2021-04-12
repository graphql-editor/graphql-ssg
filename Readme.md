# GraphQL SSG

[![NPM Version](https://img.shields.io/npm/v/graphql-ssg.svg?style=flat)]()
![Build](https://github.com/graphql-editor/graphql-ssg/actions/workflows/release.yml/badge.svg)

Simple bundler for GraphQL based website using esmodules.

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

### Injected built in functions

GraphQL SSG comes with injected functions

#### html

It doesnt transform html in any way, but gives you syntax coloring

```js
const ADiv = html`
  <div>Hello world</div>
`;
```

### useBrowser

Allows to write code that will be executed inside browser

```js
useBrowser(() => {
  // This will be imported in browser module
  const { h  = await import ("https://cdn.skypack.dev/preact")
  console.log("I will be executed in browser module yay!")
})
```

### useInBrowser

Allows to use variable generated during SSG phase in browser

```js
const someVar = { data: await Gql.query({ pokemons: { id: true } }) };
useInBrowser({ someVar });
```

## Roadmap

- [ ] Add esbuild
- [ ] Add TS support
- [ ] Add loaders for internal files
- [ ] Add intelligent global.d.ts autocompletion for imported es modules
- [ ] Add image supports
- [ ] Add classic import support
