import { Utils } from 'graphql-zeus';
import { GenerateGlobalTypings } from './fn';
import WebSocket from 'ws';
import { ConfigFile } from '@/config';
import fs from 'fs';
import { parse } from 'dotenv';
import { message } from '@/console';

const envs = () =>
  fs.existsSync('./.env') ? parse(fs.readFileSync('./.env')) : {};

const internals = () => {
  const ssg = {
    env: envs(),
  };
  return `const ssg = ${JSON.stringify(ssg, null, 4)}`;
};

interface EventFromWebsocket {
  type: 'rendered' | 'error';
  operationId: string;
  result: EventResult;
  head?: string;
  error?: string;
}

interface EventResult {
  body: string;
  head?: string;
}

export const HtmlSkeletonStatic = ({
  body,
  cssName,
  scriptName,
  head = '',
}: {
  body: string;
  cssName?: string;
  scriptName: string;
  head?: string;
}) => `<!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8">
    ${
      cssName
        ? `<link rel="stylesheet" type="text/css" media="screen" href="./${cssName}"/>`
        : ''
    }
    ${`<script type="module" src="./${scriptName}"></script>`}${
  head ? `\n${head}` : ''
}
  </head>
  <body>
    ${body}
  </body>
</html>`;

export const sendAndReceiveCode = (
  code: string,
  config: ConfigFile,
): Promise<EventResult> =>
  new Promise((resolve) => {
    const wsClient = new WebSocket(`ws://127.0.0.1:${config.websocketPort}`);
    const operationId = Math.random().toString(36);
    const inject = internals();
    wsClient.on('error', (e) => {
      message('Sending code to browser', 'yellowBright');
      throw new Error(e.message);
    });
    wsClient.on('message', (e) => {
      const event = JSON.parse(e.toString()) as EventFromWebsocket;
      if (event.operationId === operationId) {
        if (event.type === 'rendered' && event.result) {
          message('Code render successful', 'greenBright');
          resolve(event.result as EventResult);
        }
        if (event.type === 'error') {
          message('Unexpected error ocurred', 'red');
          console.error(event.error);
        }
      }
    });
    wsClient.on('open', () => {
      message('Sending code to browser', 'yellowBright');
      wsClient.send(
        JSON.stringify({
          code: [inject, code].join('\n'),
          type: 'initial',
          operationId,
        }),
      );
    });
  });

export const bundle = async ({
  code,
  css,
  config,
  name,
}: {
  code: string;
  name: string;
  css?: string;
  config: ConfigFile;
}) => {
  const socketResult = await sendAndReceiveCode(code, config);
  return HtmlSkeletonStatic({
    body: socketResult.body,
    head: socketResult.head,
    scriptName: name,
    cssName: css,
  });
};

export const globalTypings = async ({ schemaUrl }: { schemaUrl: string }) => {
  const schema = await Utils.getFromUrl(schemaUrl);
  return GenerateGlobalTypings({ schema, url: schemaUrl });
};
