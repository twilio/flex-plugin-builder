import fs from 'fs';

import * as preStartCheck from '../pre-start-check';
import * as preScriptCheck from '../pre-script-check';
import * as prints from '../../prints';
import * as fsScripts from 'flex-dev-utils/dist/fs';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../prints/appConfigMissing');

describe('PreStartCheck', () => {
  const paths = {
    app: {
      version: '1.0.0',
      name: 'plugin-test',
      dir: 'test-dir',
      nodeModulesDir: 'test-node-modules',
      appConfig: 'appConfig.js',
    },
  }

  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
  });

  describe('main', () => {
    const _checkAppConfig = jest.spyOn(preStartCheck, '_checkAppConfig');
    const _setPluginDir = jest.spyOn(preScriptCheck, '_setPluginDir');

    beforeEach(() => {
      _checkAppConfig.mockReset();
      _setPluginDir.mockReset();

      _checkAppConfig.mockReturnThis();
      _setPluginDir.mockReturnThis();
    });

    afterAll(() => {
      _checkAppConfig.mockRestore();
      _setPluginDir.mockRestore();
    });

    it('should call all methods', async () => {
      await preStartCheck.default();

      expect(_checkAppConfig).toHaveBeenCalledTimes(1);
      expect(_setPluginDir).toHaveBeenCalledTimes(1);
    });
  });

  describe('_checkAppConfig', () => {
    it('quit if no appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(false);

      preStartCheck._checkAppConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
      expect(prints.appConfigMissing).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      existSync.mockRestore();
    });

    it('not quit if appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(true);

      preStartCheck._checkAppConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
      expect(prints.appConfigMissing).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      existSync.mockRestore();
    });
  });
});
