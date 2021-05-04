import { HtmlSkeletonStatic, sendAndReceiveCode } from '@/module';
import { mock } from '@/__tests__/__mocks__';
import WebSocket from 'ws';
describe('module.ts tests', () => {
  it('Generates static HTML Skeleton', () => {
    const htmlskeleton = HtmlSkeletonStatic({
      body: 'Hello world',
      script: "console.log('Hello world')",
      style: 'body{margin:0;}',
    });
    expect(htmlskeleton).toEqual(`<html>
  <head>
    <style id="styleTag">
      body{margin:0;}
    </style>
    <script type="module">
      console.log('Hello world')
    </script>
  </head>
  <body>
    Hello world
  </body>
</html>`);
  });
  it('Sends and receive bundle info from websocket', async (done) => {
    const ws = new WebSocket.Server({ port: mock.configFile.websocketPort });
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

    const dryadResult = await sendAndReceiveCode('code', mock.configFile);
    expect(dryadResult).toBeTruthy();
    ws.close();
  });
});
