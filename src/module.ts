import WebSocket from 'ws';
import { ConfigFile } from '@/config';
import { message } from '@/console';
import path from 'path';

const PARSE_STACK_MESSAGE_REGEX = new RegExp(/https?:\/\/[^\/]*\/[^\/]*\//gm);

interface EventFromWebsocket {
  type: 'rendered' | 'error' | 'module';
  operationId: string;
  result: EventResult;
  head?: string;
  error?: string;
}
export interface Page {
  slug: string;
  body: string;
  data?: any;
  head?: string;
}
interface EventResult {
  body?: string;
  pages?: Page[];
  data?: any;
  head?: string;
}

export const HtmlSkeletonStatic = ({
  body,
  cssName,
  scriptName,
  data,
  head = '',
  hydrate,
}: {
  body: string;
  data?: any;
  cssName?: string;
  scriptName: string;
  head?: string;
  hydrate?: boolean;
}) => `<!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8">
    ${
      cssName
        ? `<link rel="stylesheet" type="text/css" media="screen" href="./${cssName}"/>`
        : ''
    }
    ${`<script type="module" src="./${scriptName}"></script>`}${
  data
    ? `<script type="module">
      import { hydrate } from "./${scriptName}";
      hydrate(${JSON.stringify(data)})
    </script>`
    : ''
}${head ? `\n${head}` : ''}
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
          resolve(event.result as EventResult);
        }
        if (event.type === 'error') {
          message(`Unexpected error ocurred in ${filePath}`, 'red');
          const e = JSON.parse(event.error || '{}');
          const stackMessage: string = e.stack || e.message || '';
          message(
            stackMessage.replace(
              PARSE_STACK_MESSAGE_REGEX,
              config.in.endsWith('/') ? config.in : `${config.in}/`,
            ),
            'red',
          );
          resolve(undefined);
        }
        if (event.type === 'module') {
          resolve(undefined);
        }
      }
    });
    wsClient.on('open', () => {
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
}): Promise<{ pages?: Page[]; content?: string } | undefined> => {
  const socketResult = await sendAndReceiveCode(name, config);
  if (!socketResult) {
    return;
  }
  if (socketResult.pages) {
    return {
      pages: socketResult.pages.map((b) => ({
        ...b,
        body: HtmlSkeletonStatic({
          ...b,
          scriptName: path.join('..', name),
          cssName: css ? path.join('..', css) : undefined,
        }),
      })),
    };
  }
  return {
    content: HtmlSkeletonStatic({
      ...socketResult,
      body: socketResult.body as string,
      head: socketResult.head as string,
      scriptName: name,
      cssName: css,
    }),
  };
};
