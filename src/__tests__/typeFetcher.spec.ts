import {
  constructTypingsUrl,
  mergePackages,
  parseDocumentToFindPackages,
} from '@/typeFetcher';
describe('typeFetcher.ts tests', () => {
  it('Parses the imports from content', () => {
    const packages = parseDocumentToFindPackages(`
        import hybrids from 'https://cdn.skypack.dev/hybrids'
        import { html } from './ssg'
        import preact from 'https://cdn.skypack.dev/preact'
        `);
    expect(packages.includes('hybrids')).toBeTruthy();
    expect(packages.includes('preact')).toBeTruthy();
  });
  it('Merges the packages from content', () => {
    const packages = mergePackages([
      `
    import hybrids from 'https://cdn.skypack.dev/hybrids'
    import { html } from './ssg'
    import preact from 'https://cdn.skypack.dev/preact'
    `,
      `
    import hybrids from 'https://cdn.skypack.dev/hybrids'
    import axios from 'https://cdn.skypack.dev/axios'
    `,
    ]);
    expect(packages.filter((p) => p === 'hybrids')).toHaveLength(1);
    expect(packages.filter((p) => p === 'preact')).toHaveLength(1);
    expect(packages.filter((p) => p === 'axios')).toHaveLength(1);
  });
  it('Constructs typings url', async () => {
    const typings = await constructTypingsUrl({
      baseUrl: 'https://cdy.skypack.dev',
      packageName: 'hybrids',
      typingsPath: 'types/index.d.ts',
    });
    expect(typings).toEqual('https://cdy.skypack.dev/hybrids/types/index.d.ts');
  });
});
