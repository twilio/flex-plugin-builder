import { TwilioError } from 'flex-plugins-utils-exception';

import FlexPluginError from '../../errors/FlexPluginError';
import logger from '../../logger';
import * as fs from '../../fs';

jest.mock('../../logger');

describe('FlexPluginError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend TwilioError', () => {
    expect(new FlexPluginError('')).toBeInstanceOf(TwilioError);
  });

  it('should be of its instance', () => {
    expect(new FlexPluginError('')).toBeInstanceOf(FlexPluginError);
  });

  it('should print message', () => {
    const err = new FlexPluginError('some-error-message');

    err.print();
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('some-error-message'));
  });

  it('should print details', () => {
    jest.spyOn(fs, 'readAppPackageJson').mockReturnValue({
      name: 'plugin-test',
      version: '1.2.3',
      dependencies: {
        'flex-plugin': '2.0.0',
        'flex-plugin-scripts': '3.0.0',
      },
      devDependencies: {},
    });

    const err = new FlexPluginError();

    err.details();
    expect(logger.info).toHaveBeenCalledTimes(3);
  });

  it('should not print any details if pkg is not found', () => {
    jest.spyOn(fs, 'readPackageJson').mockImplementation(() => {
      throw new Error();
    });

    const err = new FlexPluginError();

    err.details();
    expect(logger.info).not.toHaveBeenCalled();
  });
});
