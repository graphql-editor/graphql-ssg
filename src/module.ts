import { Utils } from 'graphql-zeus';
import { GenerateGlobalTypings } from './fn';
import WebSocket from 'ws';
import { ConfigFile } from '@/config';

interface EventFromWebsocket {
  type: 'rendered' | 'error';
  operationId: string;
  result: string;
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
}) => `<html>
  <head>
    ${head}${
  cssName
    ? `<link rel="stylesheet" type="text/css" media="screen" href="./${cssName}" />`
    : ''
}
    ${`<script type="module" src="./${scriptName}"></script>`}
  </head>
  <body>
    ${body}
  </body>
</html>`;

export const sendAndReceiveCode = (
  code: string,
  config: ConfigFile,
): Promise<string> =>
  new Promise((resolve) => {
    const wsClient = new WebSocket(`ws://127.0.0.1:${config.websocketPort}`);
    const operationId = Math.random().toString(36);
    wsClient.on('error', (e) => {
      throw new Error(e.message);
    });
    wsClient.on('message', (e) => {
      const event = JSON.parse(e.toString()) as EventFromWebsocket;
      if (event.operationId === operationId) {
        if (event.type === 'rendered' && event.result) {
          resolve(event.result as string);
        }
        if (event.type === 'error') {
          throw new Error(event.result);
        }
      }
    });
    wsClient.on('open', () => {
      wsClient.send(JSON.stringify({ code, type: 'initial', operationId }));
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
    body: socketResult,
    scriptName: name,
    cssName: css,
  });
};

export const globalTypings = async ({ schemaUrl }: { schemaUrl: string }) => {
  const schema = await Utils.getFromUrl(schemaUrl);
  return GenerateGlobalTypings({ schema, url: schemaUrl });
};
