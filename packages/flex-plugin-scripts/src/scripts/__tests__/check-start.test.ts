import fs from 'fs';
import { join } from 'path';

import * as prints from '../../prints';
import * as checkStartScript from '../check-start';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../prints/versionMismatch');
jest.mock('../../prints/unbundledReactMismatch');
jest.mock('../../prints/appConfigMissing');
jest.mock('../../prints/cracoConfigMissing');
jest.mock('../../prints/publicDirCopyFailed');
jest.mock('../../prints/expectedDependencyNotFound');
jest.mock('../../prints/loadPluginCountError');

// tslint:disable-next-line
const lernaVersion = require(join(process.cwd(), 'node_modules/lerna/package.json')).version;

describe('CheckStartScript', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  describe('main', () => {
    const _checkAppConfig = jest
      .spyOn(checkStartScript, '_checkAppConfig')
      .mockReturnValue(undefined);
    const _checkCracoConfig = jest
      .spyOn(checkStartScript, '_checkCracoConfig')
      .mockReturnValue(undefined);
    const _checkPublicDirSync = jest
      .spyOn(checkStartScript, '_checkPublicDirSync')
      .mockReturnValue(undefined);
    const _checkExternalDepsVersions = jest
      .spyOn(checkStartScript, '_checkExternalDepsVersions')
      .mockReturnValue(undefined);
    const _checkPluginCount = jest
      .spyOn(checkStartScript, '_checkPluginCount')
      .mockReturnValue(undefined);

    beforeEach(() => {
      _checkAppConfig.mockReset();
      _checkCracoConfig.mockReset();
      _checkPublicDirSync.mockReset();
      _checkExternalDepsVersions.mockReset();
      _checkPluginCount.mockReset();
    });

    afterAll(() => {
      _checkAppConfig.mockRestore();
      _checkCracoConfig.mockRestore();
      _checkPublicDirSync.mockRestore();
      _checkExternalDepsVersions.mockRestore();
      _checkPluginCount.mockRestore();
    });

    const expectCalled = (allowSkip: boolean, allowReact: boolean) => {
      expect(_checkAppConfig).toHaveBeenCalledTimes(1);
      expect(_checkCracoConfig).toHaveBeenCalledTimes(1);
      expect(_checkPublicDirSync).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledWith(allowSkip, allowReact);
      expect(_checkPluginCount).toHaveBeenCalledTimes(1);
    };

    it('should call all methods', async () => {
      await checkStartScript.default();

      expectCalled(false, false);
    });

    it('should call all methods and allow skip', async () => {
      process.env.SKIP_PREFLIGHT_CHECK = 'true';
      await checkStartScript.default();

      expectCalled(true, false);
    });

    it('should call all methods and allow react', async () => {
      process.env.UNBUNDLED_REACT = 'true';
      await checkStartScript.default();

      expectCalled(false, true);
    });
  });

  describe('_checkAppConfig', () => {
    it('quit if no appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(false);

      checkStartScript._checkAppConfig();

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

      checkStartScript._checkAppConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
      expect(prints.appConfigMissing).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      existSync.mockRestore();
    });
  });

  describe('_checkCracoConfig', () => {
    it('quit if no cracoConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(false);

      checkStartScript._checkCracoConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('craco.config.js'));
      expect(prints.cracoConfigMissing).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      existSync.mockRestore();
    });

    it('not quit if appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(true);

      checkStartScript._checkCracoConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('craco.config.js'));
      expect(prints.cracoConfigMissing).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      existSync.mockRestore();
    });
  });

  describe('_checkPublicDirSync', () => {
    it('quit if copying file fails', () => {
      const err = new Error('asd');
      const copyFileSync = jest
        .spyOn(fs, 'copyFileSync')
        .mockImplementation(() => {
          throw err;
        });

      checkStartScript._checkPublicDirSync(true);

      expect(copyFileSync).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).toHaveBeenCalledWith(err, true);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      copyFileSync.mockRestore();
    });

    it('not quit if copying file pass', () => {
      const copyFileSync = jest
        .spyOn(fs, 'copyFileSync')
        .mockReturnValue(undefined);

      checkStartScript._checkPublicDirSync(true);

      expect(copyFileSync).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      copyFileSync.mockRestore();
    });
  });

  describe('_verifyPackageVersion', () => {
    it('should quit if expected dependency is not found', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: {},
      };
      checkStartScript._verifyPackageVersion(pkg, false, false, 'foo');

      expect(prints.expectedDependencyNotFound).toHaveBeenCalledTimes(1);
      expect(prints.expectedDependencyNotFound).toHaveBeenCalledWith('foo');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should warn about version mismatch and quit', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { lerna: '10.0.0' },
      };
      checkStartScript._verifyPackageVersion(pkg, false, false, 'lerna');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('lerna', lernaVersion, '10.0.0', false);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should warn about version mismatch but not quit', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { lerna: '10.0.0' },
      };
      checkStartScript._verifyPackageVersion(pkg, true, false, 'lerna');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('lerna', lernaVersion, '10.0.0', true);
      expect(exit).not.toHaveBeenCalled();
    });

    it('should find no conflict with pinned dependency', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { lerna: lernaVersion },
      };
      checkStartScript._verifyPackageVersion(pkg, false, false, 'lerna');

      expect(exit).not.toHaveBeenCalled();
    });

    it('should find no conflict with unpinned dependency', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { lerna: `^${lernaVersion}` },
      };
      checkStartScript._verifyPackageVersion(pkg, false, false, 'lerna');

      expect(exit).not.toHaveBeenCalled();
    });

    it('should warn if allowReact but unsupported flex-ui', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { lerna: `10.0.0` },
      };
      checkStartScript._verifyPackageVersion(pkg, false, true, 'lerna');

      expect(prints.unbundledReactMismatch).toHaveBeenCalledTimes(1);
      expect(prints.unbundledReactMismatch).toHaveBeenCalledWith('1.18.0', 'lerna', lernaVersion, false);
      expect(prints.versionMismatch).not.toHaveBeenCalled();
      expect(exit).toHaveBeenCalled();
    });

    it('should warn if allowReact', () => {
      const pkg = {
        version: '1.19.0',
        dependencies: { lerna: `10.0.0` },
      };
      checkStartScript._verifyPackageVersion(pkg, false, true, 'lerna');

      expect(prints.unbundledReactMismatch).not.toHaveBeenCalled();
      expect(prints.versionMismatch).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });
  });

  describe('_checkPluginCount', () => {
    const _readIndexPage = jest
      .spyOn(checkStartScript, '_readIndexPage');

    beforeEach(() => {
      _readIndexPage.mockReset();
    })

    afterAll(() => {
      _readIndexPage.mockRestore();
    })

    it('should check with no error', () => {
      _readIndexPage.mockReturnValue('blahblah\nFlexPlugin.loadPlugin\nblahblah');
      checkStartScript._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).not.toHaveBeenCalled();
    });

    it('should check with no error', () => {
      _readIndexPage.mockReturnValue('blahblah\nFlexPlugin.loadPlugin\nblahblah');
      checkStartScript._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).not.toHaveBeenCalled();
      expect(prints.loadPluginCountError).not.toHaveBeenCalled();
    });

    it('should warn no loadPlugin was called', () => {
      _readIndexPage.mockReturnValue('blahblah');
      checkStartScript._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledTimes(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledWith(0);
    });

    it('should warn that multiple loadPlugins were called', () => {
      _readIndexPage.mockReturnValue('blahblah\nloadPlugin\nloadPlugin\nloadPlugin\nblahblah');
      checkStartScript._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledTimes(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledWith(3);
    });
  });
});
