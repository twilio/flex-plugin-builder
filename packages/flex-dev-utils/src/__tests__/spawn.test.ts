import spawn from '../spawn';
import logger from '../logger';

jest.mock('../logger');

// tslint:disable
const execa = require('execa');
// tslint:enable

describe('spawn', () => {
  const args = ['arg1', 'arg2'];

  it('should exit correctly', async () => {
    execa.mockResolvedValue({
      exitCode: 123,
      stdout: 'the-stdout',
      stderr: 'the-stderr',
    });

    const { exitCode, stdout, stderr } = await spawn('node', args);

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('node', args, expect.any(Object));
    expect(exitCode).toEqual(123);
    expect(stdout).toEqual('the-stdout');
    expect(stderr).toEqual('the-stderr');
  });

  it('should log error if SIGKILL', async () => {
    execa.mockResolvedValue({ signal: 'SIGKILL' });

    await spawn('node', args);

    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should log error if SIGTERM', async () => {
    execa.mockResolvedValue({ signal: 'SIGTERM' });

    await spawn('node', args);

    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should catch exception', async () => {
    execa.mockImplementation(() => {
      throw new Error('some-error');
    });

    const resp = await spawn('node', args);

    expect(resp.exitCode).toEqual(1);
    expect(resp.stderr).toEqual('some-error');
  });
});
