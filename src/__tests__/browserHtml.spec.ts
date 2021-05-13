import { browserHtml } from '@/browserHtml';
import { mock } from '@/__tests__/__mocks__';

describe('Check browser file generation', () => {
  it('Injects websocket port', () => {
    const html = browserHtml(mock.config);
    expect(html).toContain(`127.0.0.1:${mock.config.websocketPort}`);
  });
});
