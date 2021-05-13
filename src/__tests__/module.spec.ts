import { HtmlSkeletonStatic, sendAndReceiveCode } from '@/module';
import { mock } from '@/__tests__/__mocks__';
import WebSocket from 'ws';
describe('module.ts tests', () => {
  it('Generates static HTML Skeleton', () => {
    const htmlskeleton = HtmlSkeletonStatic({
      body: 'Hello world',
      scriptName: 'hello.js',
      cssName: 'hello.css',
    });
    expect(htmlskeleton.replace(/(\s|\n|\t)/, '')).toEqual(
      `<!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" media="screen" href="./hello.css"/>
    <script type="module" src="./hello.js"></script>
  </head>
  <body>
    Hello world
  </body>
</html>`.replace(/(\s|\n|\t)/, ''),
    );
  });
  it('Sends and receive bundle info from websocket', async (done) => {
    const ws = new WebSocket.Server({ port: mock.config.websocketPort });
    ws.on('connection', (w) => {
      w.on('message', (message) => {
        const m = JSON.parse(message.toString());
        if (m.type === 'initial' && m.operationId) {
          w.send(
            JSON.stringify({
              type: 'rendered',
              operationId: m.operationId,
              result: {
                body: 'Hello',
                script: 'world',
              },
            }),
          );
        }
      });
      w.on('close', () => done());
    });

    const dryadResult = await sendAndReceiveCode('code', mock.config);
    expect(dryadResult).toBeTruthy();
    ws.close();
  });
});
