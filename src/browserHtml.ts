import { ConfigFile } from '@/config';

export const browserHtml = (config: ConfigFile) => `
<html>
  <head>
    <script type="module">
      const ws = new WebSocket('ws://127.0.0.1:${config.websocketPort}');

      ws.onmessage = async (ev) => {
        const { code, type, operationId } = JSON.parse(ev.data);
        if (type === 'initial' && operationId) {
          try{
            const c = await Render(code);
            if(c.default){
              const body = await c.default()
              const head = c.head ? await c.head() : ''
              ws.send(JSON.stringify({ type: 'rendered', result: {
                body: await c.default(),
                head,
              }, operationId }));
            }
          }catch(e){
            ws.send(JSON.stringify({ type: 'error', error: e.message, operationId }));
          }
        }
      }

      async function Render(code) {
        const esmUrl = URL.createObjectURL(
          new Blob([code], { type: 'text/javascript' }),
        );
        const module = await import(esmUrl)
        return module
      }

    </script>
  </head>
  <body></body>
</html>

`;
