import FlexPluginError from '../../errors/FlexPluginError';
import { logger } from '../..';
import * as fs from '../../fs';

// jest.mock('../../logger');

describe('FlexPluginError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new instance', () => {
    const err = new FlexPluginError();

    expect(err).toBeInstanceOf(FlexPluginError);
    expect(err instanceof FlexPluginError).toEqual(true);
  });

  it('should print message', () => {
    const err = new FlexPluginError('some-error-message');

    err.print();
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('some-error-message'));
  });

  it('should print details', () => {
    jest.spyOn(fs, 'readPackageJson')
      .mockReturnValue({
        name: 'plugin-test',
        version: '1.2.3',
        dependencies: {
          'craco-config-flex-plugin': '1.0.0',
          'flex-plugin': '2.0.0',
          'flex-plugin-scripts': '3.0.0',
        },
      });

    const err = new FlexPluginError();

    err.details();
    expect(logger.info).toHaveBeenCalledTimes(4);
  });

  it('should not print any details if pkg is not found', () => {
    jest.spyOn(fs, 'readPackageJson')
      .mockImplementation(() => { throw new Error(); });

    const err = new FlexPluginError();

    err.details();
    expect(logger.info).not.toHaveBeenCalled();
  });
});
