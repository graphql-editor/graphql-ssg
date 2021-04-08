# GraphQL SSG

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

## Roadmap

- [ ] Add esbuild
- [ ] Add TS support
- [ ] Add loaders for internal files
