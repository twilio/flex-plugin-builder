// eslint-disable-next-line import/no-named-as-default
import node from '../node';

jest.mock('execa');

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const execa = require('execa');

describe('node', () => {
  const args = ['arg1', 'arg2'];
  const spawnResult = {
    exitCode: 123,
    stdout: 'the-stdout',
    stderr: 'the-stderr',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should spawn node', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await node(args);
    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('node', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });
});
