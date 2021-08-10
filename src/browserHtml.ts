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
            if(c.default || c.pages){
              const data = c.data && await c.data()
              const body = c.default ? await c.default(data) : ''
              const pages = c.pages ? await c.pages(data) : ''
              const head = c.head ? await c.head() : ''
              ws.send(JSON.stringify({ type: 'rendered', result: {
                body,
                data,
                pages,
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
