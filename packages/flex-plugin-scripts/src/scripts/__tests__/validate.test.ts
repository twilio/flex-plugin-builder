import os from 'os';

import * as flexDevUtils from '@twilio/flex-dev-utils';
import * as fs from '@twilio/flex-dev-utils/dist/fs';

import * as prints from '../../prints';
import * as validateScript from '../validate';
import * as flexPluginScripts from '../..';
import { ValidateReport } from '../../clients/governor';

jest.mock('../../clients/governor');
jest.mock('../../prints/validateSuccessful');
const exit = jest.spyOn(process, 'exit').mockReturnThis();

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const GovernorClient = require('../../clients/governor').default;

describe('ValidateScript', () => {
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
    // eslint-disable-next-line camelcase
    api_compatibility: [
      {
        file: '/path/to/file1.ts',
        warnings: [
          {
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
            warningMessage: 'Do not use version 1.2.0',
            recommendation: {
              message: 'Use 2.0.5 instead',
            },
          },
        ],
      },
    ],
    errors: [],
    // eslint-disable-next-line camelcase
    dom_manipulation: [],
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

  it('should validate plugin', async () => {
    const args = ['-l', 'debug'];
    await validateScript.default(...args);

    expect(setEnvSpy).toHaveBeenCalledTimes(1);
    expect(setEnvSpy).toHaveBeenCalledWith(...args);

    expect(clearTerminalSpy).toHaveBeenCalledTimes(1);
    expect(flexUiVersionSpy).toHaveBeenCalledWith('@twilio/flex-ui');
    expect(zipSpy).toHaveBeenCalledWith(zipFile, 'dir', paths.app.srcDir, paths.app.pkgPath);
    expect(validate).toHaveBeenCalledWith(zipFile, paths.app.name, '1.34.2');
    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(writeJsonSpy).toHaveBeenCalledWith(validateReport, `${paths.cwd}/logs/validate-12345.json`);

    expect(prints.validateSuccessful).toHaveBeenCalledWith(validateReport);
    expect(errorLogSpy).not.toHaveBeenCalled();
    expect(removeFileSpy).toHaveBeenCalledWith(zipFile);
    expect(exit).not.toHaveBeenCalled();
  });
});
