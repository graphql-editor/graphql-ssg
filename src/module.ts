import { Utils } from 'graphql-zeus';
import { DryadFunction } from './fn';

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

export const bundle = async ({
  schemaUrl,
  js,
  css,
}: {
  schemaUrl: string;
  js: string;
  css?: string;
}) => {
  const schema = await Utils.getFromUrl(schemaUrl);
  const r = await DryadFunction({
    js,
    schema,
    url: schemaUrl,
  });
  return HtmlSkeletonStatic({
    body: r.body,
    script: r.script,
    style: css,
  });
};
