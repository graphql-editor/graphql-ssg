import { Parser, TreeToTS } from 'graphql-zeus';
import { parse } from 'dotenv';
import fs from 'fs';
// @ts-ignore
import { Remarkable } from 'remarkable';
import fetch from 'node-fetch';
import { ConfigFile } from './config';

export interface DryadFunctionProps {
  schema: string;
  configFile: ConfigFile;
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
  configFile,
}: DryadFunctionProps) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser');
  return [DryadDeclarations, envsTypings(configFile), jsSplit.definitions]
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

const tsType = (a: unknown): string => {
  if (a === undefined) {
    return '{}';
  }
  if (Array.isArray(a)) {
    return `[${a.map((k) => tsType(a[k])).join(', ')}]`;
  }
  if (typeof a === 'object') {
    if (a === null) {
      return 'null';
    }
    return `{${Object.keys(a)
      .map((k) => `${k}: ${tsType((a as Record<string, string>)[k])}`)
      .join(';\n')}}`;
  }
  return typeof a;
};

const envsTypings = (configFile: ConfigFile) => {
  const envs = fs.existsSync('./.env')
    ? parse(fs.readFileSync('./.env'))
    : undefined;
  const ssg = {
    envs,
    config: configFile,
  };
  return `
declare const ssg: ${tsType(ssg)}`;
};

export const DryadFunctionBodyString = ({
  schema,
  configFile,
}: DryadFunctionProps) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser');
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  const functions = jsString.replace(/export /gm, '');
  return [functions, addonFunctions].join('\n');
};
