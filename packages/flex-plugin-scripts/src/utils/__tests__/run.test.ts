import { logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as run from '../run';

jest.mock('flex-dev-utils/dist/logger');

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
    it('should quit if isRequiredScript is true', () => {
      const isRequiredScript = jest.spyOn(run, 'isRequiredScript').mockReturnValue(false);

      run.exit(123, []);

      expect(isRequiredScript).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(123);
    });

    it('should quit if arg has the flag', () => {
      const isRequiredScript = jest.spyOn(run, 'isRequiredScript').mockReturnValue(true);

      run.exit(123, ['--process-exit']);

      expect(isRequiredScript).not.toHaveBeenCalled();
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(123);
    });

    it('should not quit', () => {
      const isRequiredScript = jest.spyOn(run, 'isRequiredScript').mockReturnValue(true);

      run.exit(123, []);

      expect(isRequiredScript).toHaveBeenCalledTimes(1);
      expect(exit).not.toHaveBeenCalled();
    });
  });
});
