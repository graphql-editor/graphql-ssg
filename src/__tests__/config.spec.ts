import { mock } from '@/__tests__/__mocks__';
import fs from 'fs';
jest.mock('fs', () => {
  return {
    readFileSync: (path: fs.PathLike) => {
      return JSON.stringify(mock.config);
    },
    existsSync: (p: string) => {
      return true;
    },
    writeFileSync: (p: string) => {},
  } as Partial<
    {
      [P in keyof typeof fs]: any;
    }
  >;
});

describe('Test config module', () => {
  it('validates correct config', () => {});
  it('throws error on incorrect config', () => {});
  it('inits config', () => {});
  it('reads config', () => {});
});
