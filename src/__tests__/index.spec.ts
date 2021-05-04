import '@/index';
jest.mock('yargs', () => {
  const d = () => ({
    usage: jest.fn(),
    option: jest.fn(),
    demandCommand: jest.fn(),
    argv: jest.fn(),
  });
  const a = () => ({
    usage: d,
    option: d,
    demandCommand: d,
    argv: d,
  });
  const c = () => ({
    usage: a,
    option: a,
    demandCommand: a,
    argv: a,
  });
  const b = () => ({
    usage: c,
    option: c,
    demandCommand: c,
    argv: c,
  });
  return {
    usage: b,
    option: b,
    demandCommand: b,
    argv: b,
  };
});

describe('Test if cli is running', () => {
  it('runs CLI', () => {});
});
