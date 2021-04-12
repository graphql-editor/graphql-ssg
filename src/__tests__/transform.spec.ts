import { ConfigFile } from '@/config';
import { createTwinFile, hasTwinFile, readFiles } from '@/transform';

const paths = [
  'Detail.mock.zeus.js',
  'Detail.mock.css',
  'index.html',
  'somemodule.js',
];

const config: ConfigFile = {
  url: 'https://example.org/graphql',
  in: '',
  out: './out',
  websocketPort: 1414,
  port: 8080,
};

import fs from 'fs';
jest.mock('fs', () => {
  return {
    readdirSync: (path: fs.PathLike) => {
      return paths;
    },
    existsSync: (p: string) => {
      return paths.includes(p);
    },
  } as Partial<
    {
      [P in keyof typeof fs]: any;
    }
  >;
});

describe('Transform tests', () => {
  it('Create twin files for mock files', () => {
    const htmlFile = createTwinFile('Detail.myfile.zeus.js', 'html');
    expect(htmlFile).toEqual('Detail.myfile.html');
  });
  it('Throw on invalid file', () => {
    expect(() => createTwinFile('Detail.myfile.js', 'html')).toThrow();
  });
  it('List files that are ssg compatible', () => {
    const files = readFiles('./mockpath');
    expect(files).toHaveLength(1);
  });
  it('Shoud find twin file for Detaail.mock.zeus.js', () => {
    const file = hasTwinFile('Detail.mock.zeus.js', config, 'css');
    expect(file).toBeTruthy();
  });
});
