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
            const c = await import(\`./\${code}\`)
            if(c.default){
              const data = c.data && await c.data()
              const body = await c.default(data)
              const head = c.head ? await c.head() : ''
              ws.send(JSON.stringify({ type: 'rendered', result: {
                body,
                data,
                head,
              }, operationId }));
            }else{
              ws.send(JSON.stringify({ type: 'module', result: {
                body: '',
                head: '',
              }, operationId }));
            }
          }catch(e){
            ws.send(JSON.stringify({ type: 'error', error: JSON.stringify(e, Object.getOwnPropertyNames(e)), operationId }));
          }
        }
      }
    </script>
  </head>
  <body></body>
</html>

`;
