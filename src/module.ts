import { Utils } from 'graphql-zeus';
import { GenerateGlobalTypings } from './fn';
import WebSocket from 'ws';
import { ConfigFile } from '@/config';
import { message } from '@/console';

interface EventFromWebsocket {
  type: 'rendered' | 'error' | 'module';
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
  filePath: string,
  config: ConfigFile,
): Promise<EventResult | undefined> =>
  new Promise((resolve) => {
    const wsClient = new WebSocket(`ws://127.0.0.1:${config.websocketPort}`);
    const operationId = Math.random().toString(36);
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
          message(`Unexpected error ocurred in ${filePath}`, 'red');
          console.error(event.error);
          resolve(undefined);
        }
        if (event.type === 'module') {
          resolve(undefined);
        }
      }
    });
    wsClient.on('open', () => {
      message('Sending code to browser', 'yellowBright');
      wsClient.send(
        JSON.stringify({
          code: `${Math.random().toString(32)}/${filePath}`,
          type: 'initial',
          operationId,
        }),
      );
    });
  });

export const bundle = async ({
  css,
  config,
  name,
}: {
  name: string;
  css?: string;
  config: ConfigFile;
}) => {
  const socketResult = await sendAndReceiveCode(name, config);
  if (!socketResult) {
    return;
  }
  return HtmlSkeletonStatic({
    body: socketResult.body,
    head: socketResult.head,
    scriptName: name,
    cssName: css,
  });
};

export const globalTypings = async ({
  configFile,
}: {
  configFile: ConfigFile;
}) => {
  const schema = await Utils.getFromUrl(configFile.url, configFile.headers);
  return GenerateGlobalTypings({ schema, configFile });
};
