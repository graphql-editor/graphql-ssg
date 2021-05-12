import { Parser, TreeToTS } from 'graphql-zeus';
import { parse } from 'dotenv';
import fs from 'fs';
// @ts-ignore
import { Remarkable } from 'remarkable';
import fetch from 'node-fetch';
import { ConfigFile } from './config';

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
declare const html: (strings: TemplateStringsArray, ...expr: string[]) => string
declare const css: (strings: TemplateStringsArray, ...expr: string[]) => string
declare const md: (strings: TemplateStringsArray, ...expr: string[]) => string
`;

const injectedFunctions = `
  import {Remarkable} from 'https://cdn.skypack.dev/remarkable';
  export const html =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
  export const css =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
  const remarkableRenderer = new Remarkable()
  export const md = (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return remarkableRenderer.render(str);
  } 
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

export const envsTypings = (configFile: ConfigFile) => {
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

export const DryadFunctionBodyString = (schema: string) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser');
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  return [jsString, injectedFunctions].join('\n');
};

export const GenerateGlobalTypings = ({
  schema,
  configFile,
}: {
  schema: string;
  configFile: ConfigFile;
}) => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser');
  return {
    ssg: [DryadDeclarations, jsSplit.definitions].join('\n'),
    env: envsTypings(configFile),
  };
};
