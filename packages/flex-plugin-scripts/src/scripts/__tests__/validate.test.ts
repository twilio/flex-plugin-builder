import os from 'os';

import * as flexDevUtils from '@twilio/flex-dev-utils';
import * as fs from '@twilio/flex-dev-utils/dist/fs';

import * as prints from '../../prints';
import * as validateScript from '../validate';
import * as flexPluginScripts from '../..';
import { ValidateReport } from '../../clients/governor';

jest.mock('../../clients/governor');
jest.mock('../../prints/validateSuccessful');

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const GovernorClient = require('../../clients/governor').default;

describe('ValidateScript', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const paths = {
    cwd: '/path/to/current/working/dir',
    app: {
      name: 'plugin-sample',
      srcDir: '/path/to/dir/src',
      pkgPath: '/path/to/package.json',
    },
  };

  const zipFile = '/tmp/path/to/tmp-12345.zip';
  const credentials = {
    username: 'username',
    password: 'password',
  };

  const validateReport: ValidateReport = {
    /* eslint-disable */
    request_id: 'RQ12345',
    api_compatibility: [
      {
        file: '/path/to/file1.ts',
        warnings: [
          {
            name: 'Wrong method call',
            location: {
              line: 23,
              column: 50,
            },
            warningMessage: 'Do not call this method',
            recommendation: {
              message: 'Call this instead',
              code: 'const config = {\n  theme: {\n    isLight: false\n  }\n}',
            },
          },
        ],
      },
    ],
    // eslint-disable-next-line camelcase
    version_compatibility: [
      {
        file: '/path/to/package.json',
        warnings: [
          {
            name: 'Wrong version',
            warningMessage: 'Do not use version 1.2.0',
            recommendation: {
              message: 'Use 2.0.5 instead',
            },
          },
        ],
      },
    ],
    errors: [],
    dom_manipulation: [],
    /* eslint-disable */
  };

  const validate = jest.fn().mockResolvedValue(validateReport);

  GovernorClient.mockImplementation(() => ({ validate }));
  jest.spyOn(fs, 'getPaths').mockReturnValue(paths as any);
  jest.spyOn(os, 'tmpdir').mockReturnValue('/tmp/path/to/');
  jest.spyOn(Date, 'now').mockReturnValue(12345);
  jest.spyOn(flexDevUtils, 'getCredential').mockResolvedValue(credentials);

  const setEnvSpy = jest.spyOn(flexPluginScripts, 'setEnvironment');
  const flexUiVersionSpy = jest.spyOn(fs, 'getPackageVersion').mockReturnValue('1.34.2');
  const zipSpy = jest.spyOn(fs, 'zipPluginFiles').mockReturnThis();
  const checkFileExistsSpy = jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
  const mkdirSpy = jest.spyOn(fs, 'mkdirpSync').mockReturnThis();
  const writeJsonSpy = jest.spyOn(fs, 'writeJSONFile').mockReturnThis();
  const removeFileSpy = jest.spyOn(fs, 'removeFile').mockReturnThis();
  const clearTerminalSpy = jest.spyOn(flexDevUtils.logger, 'clearTerminal');
  const errorLogSpy = jest.spyOn(flexDevUtils.logger, 'error');
  const noticeLogSpy = jest.spyOn(flexDevUtils.logger, 'notice');
  const progressSpy = jest.spyOn(flexDevUtils, 'progress');

  it('should validate plugin', async () => {
    const args = ['-l', 'debug'];
    const response = await validateScript.default(...args);

    expect(setEnvSpy).toHaveBeenCalledTimes(1);
    expect(setEnvSpy).toHaveBeenCalledWith(...args);

    expect(clearTerminalSpy).toHaveBeenCalledTimes(1);
    expect(flexUiVersionSpy).toHaveBeenCalledWith('@twilio/flex-ui');
    expect(progressSpy).toHaveBeenCalledTimes(2);
    expect(zipSpy).toHaveBeenCalledWith(zipFile, 'dir', paths.app.srcDir, paths.app.pkgPath);
    expect(validate).toHaveBeenCalledWith(zipFile, paths.app.name, '1.34.2');
    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(writeJsonSpy).toHaveBeenCalledWith(
      validateReport,
      `${paths.cwd}/logs/validate-${validateReport.request_id}.json`,
    );

    expect(prints.validateSuccessful).toHaveBeenCalledWith(validateReport);
    expect(errorLogSpy).not.toHaveBeenCalled();
    expect(noticeLogSpy).toHaveBeenCalledTimes(3);
    expect(removeFileSpy).toHaveBeenCalledWith(zipFile);

    expect(response.error).toBeUndefined();
    expect(response.violations.length).toBe(2);
    expect(response.vtime).toBeGreaterThan(0);
  });

  it('should create logs directory and pass correct flex ui version', async () => {
    flexUiVersionSpy.mockReturnValueOnce('2.5.1');
    checkFileExistsSpy.mockReturnValueOnce(false);
    await validateScript.default();

    expect(validate).toHaveBeenCalledWith(zipFile, paths.app.name, '2.5.1');
    expect(mkdirSpy).toHaveBeenCalledTimes(1);
    expect(mkdirSpy).toHaveBeenCalledWith('logs');
  });

  it('should not write log file', async () => {
    writeJsonSpy.mockClear();
    /* eslint-disable */
    const noWarningReport: ValidateReport = {
      request_id: 'RQ12345',
      api_compatibility: [],

      version_compatibility: [
        {
          file: '/path/to/package.json',
          warnings: [],
        },
      ],
      dom_manipulation: [],
      errors: [],
    };
    /* eslint-disable */

    validate.mockResolvedValueOnce(noWarningReport);

    await validateScript.default();

    expect(writeJsonSpy).not.toHaveBeenCalled();
  });

  it('should display error log when validation fails', async () => {
    const errorString = '401 Unauthorized';
    validate.mockRejectedValueOnce(new Error(errorString));
    try {
      await validateScript.default();
    } catch (e) {
      expect(e).toBeInstanceOf(flexDevUtils.TwilioCliError);
      expect(e.message).toContain(errorString);
      expect(errorLogSpy).toHaveBeenCalledTimes(1);
    }
  });

  it('should not call progress if deploy flag is present', async () => {
    const args = ['--deploy'];
    await validateScript.default(...args);

    expect(progressSpy).not.toHaveBeenCalled();
    expect(clearTerminalSpy).not.toHaveBeenCalled();
    expect(zipSpy).toHaveBeenCalledWith(zipFile, 'dir', paths.app.srcDir, paths.app.pkgPath);
    expect(validate).toHaveBeenCalledWith(zipFile, paths.app.name, '1.34.2');
    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(writeJsonSpy).toHaveBeenCalledWith(
      validateReport,
      `${paths.cwd}/logs/validate-${validateReport.request_id}.json`,
    );
    expect(prints.validateSuccessful).toHaveBeenCalledWith(validateReport);
  });

  it('should not throw error if deploy flag is present', async () => {
    const args = ['--deploy'];
    const errorString = '401 Unauthorized';

    validate.mockRejectedValueOnce(new Error(errorString));

    const response = await validateScript.default(...args);
    expect(errorLogSpy).not.toHaveBeenCalled();
    expect(response.error).toContain(errorString);
    expect(response.violations.length).toBe(0);
    expect(response.vtime).toBe(0);
  });
});
