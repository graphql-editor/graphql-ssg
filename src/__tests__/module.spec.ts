import { HtmlSkeletonStatic } from '@/module';

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
});
