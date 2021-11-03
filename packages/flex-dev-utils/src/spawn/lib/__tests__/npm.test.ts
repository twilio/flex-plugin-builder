// eslint-disable-next-line import/no-named-as-default
import npm from '../npm';

jest.mock('execa');

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const execa = require('execa');

describe('spawn', () => {
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

  it('should spawn npm', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await npm(args);
    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('npm', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });
});
