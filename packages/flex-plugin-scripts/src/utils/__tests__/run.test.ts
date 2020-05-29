import { logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as run from '../run';

describe('run', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  it('should run successfully', async () => {
    const cb = jest.fn();
    await run.default(cb);

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should log normal error if not a FlexPluginError', async () => {
    const err = new Error('error-message');
    const cb = jest.fn().mockImplementation(() => {
      throw err;
    });

    await run.default(cb);

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(err);
  });

  it('should log FlexPluginError print', async () => {
    const err = new FlexPluginError('another-error');
    const print = jest.spyOn(err, 'print');
    const details = jest.spyOn(err, 'details');
    const cb = jest.fn().mockImplementation(() => {
      throw err;
    });

    await run.default(cb);

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(print).toHaveBeenCalledTimes(1);
    expect(details).not.toHaveBeenCalled();
  });

  it('should also log details of FlexPluginError', async () => {
    const err = new FlexPluginError('another-error');
    const print = jest.spyOn(err, 'print');
    const details = jest.spyOn(err, 'details');
    const cb = jest.fn().mockImplementation(() => {
      throw err;
    });
    process.env.DEBUG = 'true';

    await run.default(cb);

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(print).toHaveBeenCalledTimes(1);
    expect(details).toHaveBeenCalledTimes(1);
  });

  describe('exit', () => {
    it('should not quit if arg has the flag', () => {
      run.exit(123, ['--no-process-exit']);

      expect(exit).not.toHaveBeenCalled();
    });

    it('should quit by default', () => {
      run.exit(123);

      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(123);
    });
  });
});
