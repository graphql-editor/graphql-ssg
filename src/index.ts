#!/usr/bin/env node
import { build, watch } from './serve';
import * as yargs from 'yargs';
const args = yargs
  .usage(
    `
GraphQL SSG 🤯
GraphQL Static Site Generator
Run: graphql-ssg to watch current folder for compatible files
`,
  )
  .option('init', {
    alias: 'i',
    describe: 'Init GraphQL SSG config',
    boolean: true,
  })
  .option('build', {
    alias: 'b',
    describe: 'Build project',
    boolean: true,
  })
  .demandCommand(0).argv;

if (args.build) {
  build();
} else if (args.init) {
  //init config
} else {
  watch();
}
