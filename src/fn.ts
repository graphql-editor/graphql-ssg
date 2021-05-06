import { Parser, TreeToTS } from 'graphql-zeus';
import { parse } from 'dotenv';
import fs from 'fs';
// @ts-ignore
import { Remarkable } from 'remarkable';
import fetch from 'node-fetch';
export interface DryadFunctionProps {
  schema: string;
  url: string;
  js: string;
}

export interface DryadFunctionResult {
  body: string;
  script: string;
}
export interface DryadFunctionFunction {
  (
    remarkableRenderer: (markdownString: string) => string,
    f: typeof fetch,
  ): Promise<DryadFunctionResult>;
}

export const DryadDeclarations = `
// Return html string from this function fo ssg;
declare const render: <T>(fn:Function) => void;
declare var html: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var css: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var md: (strings: TemplateStringsArray, ...expr: string[]) => string
`;

export const GenerateGlobalTypings = ({
  schema,
  url,
}: Pick<DryadFunctionProps, 'schema' | 'url'>) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser', url);
  return [DryadDeclarations, envsTypings(), jsSplit.definitions]
    .join('\n')
    .replace(/export declare/gm, 'declare ')
    .replace(/export /gm, 'declare ');
};

const addonFunctions = `
  import {Remarkable} from 'https://cdn.skypack.dev/remarkable';
  var html = typeof html === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : html
  var css = typeof css === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : css
  const remarkableRenderer = new Remarkable()
  var md = typeof md === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return remarkableRenderer.render(str);
  } : md
  `;

const envsTypings = () => `declare var process: {
    env: ${JSON.stringify(
      fs.existsSync('./.env') ? parse(fs.readFileSync('./.env')) : {},
    )}
  }`;
const envs = () => `const process = {
  env: ${JSON.stringify(
    fs.existsSync('./.env') ? parse(fs.readFileSync('./.env')) : {},
  )}
}`;

export const DryadFunctionBodyString = async ({
  schema,
  url,
  js,
}: DryadFunctionProps) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser', url);
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  const functions = jsString.replace(/export /gm, '');
  const functionBody = [functions, addonFunctions, envs(), js].join('\n');
  return {
    code: functionBody,
    functions,
  };
};
