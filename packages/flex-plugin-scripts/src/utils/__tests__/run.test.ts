import { logger, FlexPluginError } from '@twilio/flex-dev-utils';
import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';

import * as run from '../run';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('run', () => {
  const runFlag = '--run-script';
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
    /* no-op */
  });
  const OLD_ENV = process.env;
  const OLD_ARGV = process.argv;
  jest.spyOn(fsScripts, 'readAppPackageJson').mockReturnValue({
    name: 'test-script',
    version: '0.0.0',
    dependencies: {
      '@twilio/flex-plugin': '1.2.3',
      'flex-plugin-scripts': '4.5.6',
    },
    devDependencies: {},
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
    process.argv = [...OLD_ARGV];
  });

  it('should not run', async () => {
    const cb = jest.fn();
    await run.default(cb);

    expect(cb).not.toHaveBeenCalled();
  });

  it('should run successfully', async () => {
    process.argv.push(runFlag);
    const cb = jest.fn();
    await run.default(cb);

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should log normal error if not a FlexPluginError', async () => {
    process.argv.push(runFlag);
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
    process.argv.push(runFlag);
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
    process.argv.push(runFlag);
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
});
