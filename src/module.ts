import { Utils } from 'graphql-zeus';
import {
  DryadFunctionBodyString,
  DryadFunctionResult,
  GenerateGlobalTypings,
} from './fn';
import WebSocket from 'ws';
import { ConfigFile } from '@/config';

export const HtmlSkeletonStatic = ({
  body,
  style,
  script = '',
  head = '',
}: {
  body: string;
  style?: string;
  script?: string;
  head?: string;
}) => `<html>
  <head>
    ${head}${
  style
    ? `<style id="styleTag">
      ${style}
    </style>`
    : ''
}
    ${`<script type="module">
      ${script}
    </script>`}
  </head>
  <body>
    ${body}
  </body>
</html>`;

export const sendAndReceiveCode = (
  code: string,
  config: ConfigFile,
): Promise<DryadFunctionResult> =>
  new Promise((resolve) => {
    const wsClient = new WebSocket(`ws://127.0.0.1:${config.websocketPort}`);
    const operationId = Math.random().toString(36);
    wsClient.on('message', (e) => {
      const event = JSON.parse(e.toString());
      if (
        event.type === 'rendered' &&
        event.result &&
        event.operationId === operationId
      ) {
        resolve(event.result as DryadFunctionResult);
      }
    });
    wsClient.on('open', () => {
      wsClient.send(JSON.stringify({ code, type: 'initial', operationId }));
    });
  });

export const bundle = async ({
  schemaUrl,
  js,
  css,
  config,
}: {
  schemaUrl: string;
  js: string;
  css?: string;
  config: ConfigFile;
}) => {
  const schema = await Utils.getFromUrl(schemaUrl);
  const pure = await DryadFunctionBodyString({ schema, js, url: schemaUrl });
  const socketResult = await sendAndReceiveCode(pure.code, config);
  return HtmlSkeletonStatic({
    body: socketResult.body,
    script: socketResult.script,
    style: css,
  });
};

export const globalTypings = async ({ schemaUrl }: { schemaUrl: string }) => {
  const schema = await Utils.getFromUrl(schemaUrl);
  return GenerateGlobalTypings({ schema, url: schemaUrl });
};
