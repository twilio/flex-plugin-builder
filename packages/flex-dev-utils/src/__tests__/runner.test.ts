import { FlexPluginError } from '../errors';
import * as fs from '../fs';
import runner from '../runner';

jest.mock('../logger');

describe('runner', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockReturnValue();
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  it('should invoke callback', async (done) => {
    await runner(done);

    expect(exit).not.toHaveBeenCalled();
  });

  it('should catch exception and log error', async () => {
    const err = new Error('the-error');

    await runner(() => {
      throw err;
    });
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should call print', async () => {
    jest.spyOn(fs, 'readPackageJson').mockImplementation(() => {
      throw new Error();
    });

    const err = new FlexPluginError('some-error');
    jest.spyOn(err, 'print');
    jest.spyOn(err, 'details');

    await runner(() => {
      throw err;
    });
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(err.print).toHaveBeenCalledTimes(1);
    expect(err.details).not.toHaveBeenCalled();
  });

  it('should call details', async () => {
    jest.spyOn(fs, 'readPackageJson').mockImplementation(() => {
      throw new Error();
    });

    const err = new FlexPluginError('some-error');
    jest.spyOn(err, 'print');
    jest.spyOn(err, 'details');

    process.env.DEBUG = 'true';
    await runner(() => {
      throw err;
    });
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(err.print).toHaveBeenCalledTimes(1);
    expect(err.details).toHaveBeenCalledTimes(1);
  });
});
