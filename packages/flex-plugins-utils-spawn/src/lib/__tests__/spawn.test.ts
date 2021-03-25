import { logger } from 'flex-plugins-utils-logger';

// eslint-disable-next-line import/no-named-as-default
import * as spawnScripts from '../spawn';

jest.mock('flex-plugins-utils-logger');
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

  it('should exit correctly', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await spawnScripts.default('node', args);

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('node', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });

  it('default values if nothing is returned', async () => {
    execa.mockResolvedValue({});

    const resp = await spawnScripts.default('node', args);

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('node', args, expect.any(Object));
    expect(resp).toMatchObject({
      exitCode: 0,
      stdout: '',
      stderr: '',
    });
  });

  it('should log error if SIGKILL', async () => {
    execa.mockResolvedValue({ signal: 'SIGKILL' });

    await spawnScripts.default('node', args);

    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should log error if SIGTERM', async () => {
    execa.mockResolvedValue({ signal: 'SIGTERM' });

    await spawnScripts.default('node', args);

    expect(logger.warning).toHaveBeenCalledTimes(1);
  });

  it('should catch exception', async () => {
    execa.mockImplementation(async () => Promise.reject(new Error('some-error')));

    const resp = await spawnScripts.default('node', args);

    expect(resp).toMatchObject({
      exitCode: 1,
      stdout: '',
      stderr: 'some-error',
    });
  });

  it('stderr should be empty with no message', async () => {
    execa.mockImplementation(async () => Promise.reject(new Error()));

    const resp = await spawnScripts.default('node', args);

    expect(resp).toMatchObject({
      exitCode: 1,
      stdout: '',
      stderr: '',
    });
  });

  it('should spawn node', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await spawnScripts.node(args);
    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('node', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });

  it('should spawn npm', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await spawnScripts.npm(args);
    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('npm', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });

  it('should spawn yarn', async () => {
    execa.mockResolvedValue(spawnResult);

    const resp = await spawnScripts.yarn(args);
    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('yarn', args, expect.any(Object));
    expect(resp).toMatchObject(spawnResult);
  });
});
