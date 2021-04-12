import { ConfigFile } from '@/config';

export const browserHtml = (config: ConfigFile) => `
<html>
  <head>
    <script type="module">
      import {Remarkable} from 'https://cdn.skypack.dev/remarkable';

      const ws = new WebSocket('ws://127.0.0.1:${config.websocketPort}');

      ws.onmessage = async (ev) => {
        const { code, type } = JSON.parse(ev.data);
        if (type === 'initial') {
          const c = await Render(code);
          ws.send(JSON.stringify({ type: 'rendered', result: c }));
        }
      }

      async function Render(code) {
        const r = new Function(
          'remarkableRenderer',
          \`return new Promise(async (resolve) => {
            \${code}
          })\`,
        );
        const remarkableRenderer = new Remarkable();

        const result = await r(remarkableRenderer);
        if (typeof result.body !== 'string') {
          throw new Error(
            '.js file should end with return function returning string HTML',
          );
        }
        return result;
      }
    </script>
  </head>
  <body></body>
</html>

`;
