import fs from 'fs';

import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';
import { logger } from '@twilio/flex-dev-utils';

import * as prints from '../../prints';
import * as preScriptCheck from '../pre-script-check';
import * as parser from '../../utils/parser';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('../../prints/unbundledReactMismatch');
jest.mock('../../prints/expectedDependencyNotFound');
jest.mock('../../prints/typescriptNotInstalled');
jest.mock('../../prints/loadPluginCountError');

describe('PreScriptCheck', () => {
  const pluginDir = '/path/to/plugin-dir';
  const pluginName = 'plugin-test';
  const paths = {
    scripts: {
      tsConfigPath: 'test-ts-config-path',
      dir: 'test-scripts-dir',
    },
    cli: {
      dir: 'test-dir',
      flexDir: 'test-dir-flex',
      pluginsJsonPath: 'test-dir-plugins',
    },
    app: {
      version: '1.0.0',
      name: pluginName,
      dir: 'test-dir',
      nodeModulesDir: 'test-node-modules',
      appConfig: 'appConfig.js',
    },
    assetBaseUrlTemplate: 'template',
  };

  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
    /* no-op */
  });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
    process.env = { ...OLD_ENV };
  });

  describe('main', () => {
    const _checkExternalDepsVersions = jest.spyOn(preScriptCheck, '_checkExternalDepsVersions');
    const _validateTypescriptProject = jest.spyOn(preScriptCheck, '_validateTypescriptProject');
    const _checkPluginCount = jest.spyOn(preScriptCheck, '_checkPluginCount');
    const checkPluginConfigurationExists = jest.spyOn(fsScripts, 'checkPluginConfigurationExists');
    const _setPluginDir = jest.spyOn(preScriptCheck, '_setPluginDir');
    const _comparePluginAndCLIVersions = jest.spyOn(preScriptCheck, '_comparePluginAndCLIVersions');
    const cwd = jest.spyOn(process, 'cwd');

    beforeEach(() => {
      jest.spyOn(fsScripts, 'checkAFileExists').mockReturnValue(true);
      jest.spyOn(fsScripts, 'readPackageJson').mockReturnValue({
        version: '1.0.0',
        name: pluginName,
        dependencies: {},
        devDependencies: {
          '@twilio/flex-ui': '^1',
        },
      });

      _checkExternalDepsVersions.mockReset();
      _validateTypescriptProject.mockReset();
      _checkPluginCount.mockReset();
      checkPluginConfigurationExists.mockReset();
      _setPluginDir.mockReset();
      _comparePluginAndCLIVersions.mockReset();
      cwd.mockReset();

      _checkExternalDepsVersions.mockReturnThis();
      _validateTypescriptProject.mockReturnValue(undefined);
      _checkPluginCount.mockReturnValue(undefined);
      checkPluginConfigurationExists.mockReturnThis();
      _setPluginDir.mockReturnThis();
      _comparePluginAndCLIVersions.mockReturnThis();
      cwd.mockReturnValue(pluginDir);
    });

    afterAll(() => {
      _checkExternalDepsVersions.mockRestore();
      _validateTypescriptProject.mockRestore();
      _checkPluginCount.mockRestore();
      checkPluginConfigurationExists.mockRestore();
      _setPluginDir.mockRestore();
      _comparePluginAndCLIVersions.mockRestore();
      cwd.mockRestore();
    });

    const expectCalled = (allowSkip: boolean) => {
      expect(_checkExternalDepsVersions).toHaveBeenCalledTimes(1);
      expect(_validateTypescriptProject).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledWith(allowSkip);
      expect(_checkPluginCount).toHaveBeenCalledTimes(1);
      expect(checkPluginConfigurationExists).toHaveBeenCalledTimes(1);
      expect(_comparePluginAndCLIVersions).toHaveBeenCalledTimes(1);
    };

    it('should call all methods', async () => {
      await preScriptCheck.default();

      expectCalled(false);
      expect(checkPluginConfigurationExists).toHaveBeenCalledWith(pluginName, pluginDir, false);
      expect(_setPluginDir).toHaveBeenCalledTimes(2);
    });

    it('should call with multi-plugin flag', async () => {
      await preScriptCheck.default(preScriptCheck.FLAG_MULTI_PLUGINS);

      expectCalled(false);
      expect(checkPluginConfigurationExists).toHaveBeenCalledWith(pluginName, pluginDir, true);
      expect(_setPluginDir).toHaveBeenCalledTimes(2);
    });

    it('should not call checkPluginConfigurationExists if package json does not exist', async () => {
      jest.spyOn(fsScripts, 'checkAFileExists').mockReturnValue(false);

      await preScriptCheck.default();

      expect(checkPluginConfigurationExists).toHaveBeenCalledTimes(0);
    });

    it('should not call checkPluginConfigurationExists if not in a plugin dir', async () => {
      jest.spyOn(fsScripts, 'readPackageJson').mockReturnValue({
        version: '1.0.0',
        name: pluginName,
        dependencies: {},
        devDependencies: {},
      });

      await preScriptCheck.default();

      expect(checkPluginConfigurationExists).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if a package.json exists but name does not', async () => {
      jest.spyOn(fsScripts, 'readPackageJson').mockReturnValue({
        version: '1.0.0',
        name: '',
        dependencies: {},
        devDependencies: {
          '@twilio/flex-ui': '^1',
        },
      });

      try {
        await preScriptCheck.default();
      } catch (e) {
        expect(e.message).toBe('No package name was found');
      }
    });

    it('should call all methods and allow skip', async () => {
      process.env.SKIP_PREFLIGHT_CHECK = 'true';
      await preScriptCheck.default();

      expectCalled(true);
    });

    it('should call methods in a specific order', async () => {
      await preScriptCheck.default();

      expect(_setPluginDir.mock.invocationCallOrder[0]).toBeLessThan(
        checkPluginConfigurationExists.mock.invocationCallOrder[0],
      );
    });
  });

  describe('_verifyPackageVersion', () => {
    const _require = jest.spyOn(fsScripts, '_require');
    const _pkg = {
      name: 'test-package',
      version: '1.18.0',
      dependencies: {},
      devDependencies: {},
    };

    it('should quit if expected dependency is not found', () => {
      const pkg = { ..._pkg };
      preScriptCheck._verifyPackageVersion(pkg, false, 'foo');

      expect(prints.expectedDependencyNotFound).toHaveBeenCalledTimes(1);
      expect(prints.expectedDependencyNotFound).toHaveBeenCalledWith('foo');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(_require).not.toHaveBeenCalled();
    });

    it('should warn about version mismatch and quit', () => {
      const pkg = { ..._pkg, ...{ dependencies: { somePackage: '2.0.0' } } };
      _require.mockReturnValue({ version: '1.0.0' });

      preScriptCheck._verifyPackageVersion(pkg, false, 'somePackage');

      expect(prints.unbundledReactMismatch).toHaveBeenCalledTimes(1);
      expect(prints.unbundledReactMismatch).toHaveBeenCalledWith('1.18.0', 'somePackage', '1.0.0', false);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should warn about version mismatch but not quit', () => {
      const pkg = { ..._pkg, ...{ dependencies: { somePackage: '2.0.0' } } };
      _require.mockReturnValue({ version: '1.0.0' });

      preScriptCheck._verifyPackageVersion(pkg, true, 'somePackage');

      expect(prints.unbundledReactMismatch).toHaveBeenCalledTimes(1);
      expect(prints.unbundledReactMismatch).toHaveBeenCalledWith('1.18.0', 'somePackage', '1.0.0', true);
      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should find no conflict with pinned dependency', () => {
      const pkg = { ..._pkg, ...{ dependencies: { somePackage: '1.0.0' } } };
      _require.mockReturnValue({ version: '1.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, 'somePackage');

      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should find no conflict with unpinned dependency', () => {
      const pkg = { ..._pkg, ...{ dependencies: { somePackage: '^1.0.0' } } };
      _require.mockReturnValue({ version: '1.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, 'somePackage');

      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should warn if unsupported flex-ui', () => {
      const pkg = { ..._pkg, ...{ dependencies: { somePackage: '1.0.0' } } };
      _require.mockReturnValue({ version: '2.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, 'somePackage');

      expect(prints.unbundledReactMismatch).toHaveBeenCalledTimes(1);
      expect(prints.unbundledReactMismatch).toHaveBeenCalledWith('1.18.0', 'somePackage', '2.0.0', false);
      expect(exit).toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should succeed if flex-ui version supports unbundled react', () => {
      const pkg = { ..._pkg, ...{ version: '1.19.0', dependencies: { somePackage: '1.0.0' } } };
      _require.mockReturnValue({ version: '2.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, 'somePackage');

      expect(prints.unbundledReactMismatch).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });
  });

  describe('_checkPluginCount', () => {
    const _readIndexPage = jest.spyOn(preScriptCheck, '_readIndexPage');

    beforeEach(() => {
      _readIndexPage.mockReset();
    });

    afterAll(() => {
      _readIndexPage.mockRestore();
    });

    it('should check with no error', () => {
      _readIndexPage.mockReturnValue('blahblah\nFlexPlugin.loadPlugin()\nblahblah');
      preScriptCheck._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).not.toHaveBeenCalled();
      expect(prints.loadPluginCountError).not.toHaveBeenCalled();
    });

    it('should warn no loadPlugin was called', () => {
      _readIndexPage.mockReturnValue('blahblah');
      preScriptCheck._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledTimes(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledWith(0);
    });

    it('should warn that multiple loadPlugins were called', () => {
      _readIndexPage.mockReturnValue('blahblah\n.loadPlugin(\n.loadPlugin(\n.loadPlugin(\nblahblah');
      preScriptCheck._checkPluginCount();

      expect(_readIndexPage).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledTimes(1);
      expect(prints.loadPluginCountError).toHaveBeenCalledWith(3);
    });
  });

  describe('_validateTypescriptProject', () => {
    const _hasTypescriptFiles = jest.spyOn(preScriptCheck, '_hasTypescriptFiles').mockReturnThis();
    const resolveModulePath = jest.spyOn(fsScripts, 'resolveModulePath').mockReturnThis();
    const checkFilesExist = jest.spyOn(fsScripts, 'checkFilesExist').mockReturnThis();
    const copyFileSync = jest.spyOn(fs, 'copyFileSync').mockReturnValue(undefined);

    beforeEach(() => {
      _hasTypescriptFiles.mockReset();
      resolveModulePath.mockReset();
      checkFilesExist.mockReset();
      copyFileSync.mockReset();
    });

    afterAll(() => {
      _hasTypescriptFiles.mockRestore();
      resolveModulePath.mockRestore();
      checkFilesExist.mockRestore();
      copyFileSync.mockRestore();
    });

    it('should not do anything if not a typescript project', () => {
      _hasTypescriptFiles.mockReturnValue(false);

      preScriptCheck._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });

    it('should fail if typescript project and typescript module not installed', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue(false);

      preScriptCheck._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.typescriptNotInstalled).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).not.toHaveBeenCalled();
    });

    it('should continue if typescript project and has tsconfig', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue('some-path');
      checkFilesExist.mockReturnValue(true);

      preScriptCheck._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(checkFilesExist).toHaveBeenCalledTimes(1);

      expect(copyFileSync).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
      expect(prints.typescriptNotInstalled).not.toHaveBeenCalled();
    });

    it('should create default tsconfig.json', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue('some-path');
      checkFilesExist.mockReturnValue(false);
      const _copyFileSync = jest.spyOn(fs, 'copyFileSync').mockReturnValue(undefined);

      preScriptCheck._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(_copyFileSync).toHaveBeenCalledTimes(1);

      expect(exit).not.toHaveBeenCalled();
      expect(prints.typescriptNotInstalled).not.toHaveBeenCalled();
      _copyFileSync.mockRestore();
    });
  });

  describe('_setPluginDir', () => {
    const cliJsonPath = 'the/json/path';
    const pluginPath = 'the/plugin/path';

    let checkFilesExist = jest.spyOn(fsScripts, 'checkFilesExist');
    let getCliPaths = jest.spyOn(fsScripts, 'getCliPaths');
    let setCwd = jest.spyOn(fsScripts, 'setCwd');
    let parseUserInputPlugins = jest.spyOn(parser, 'parseUserInputPlugins');
    let findFirstLocalPlugin = jest.spyOn(parser, 'findFirstLocalPlugin');

    beforeEach(() => {
      checkFilesExist = jest.spyOn(fsScripts, 'checkFilesExist');
      getCliPaths = jest.spyOn(fsScripts, 'getCliPaths');
      setCwd = jest.spyOn(fsScripts, 'setCwd');
      parseUserInputPlugins = jest.spyOn(parser, 'parseUserInputPlugins');
      findFirstLocalPlugin = jest.spyOn(parser, 'findFirstLocalPlugin');

      // @ts-ignore
      getCliPaths.mockReturnValue({ pluginsJsonPath: cliJsonPath });
    });

    afterAll(() => {
      checkFilesExist.mockRestore();
      getCliPaths.mockRestore();
      setCwd.mockRestore();
      parseUserInputPlugins.mockRestore();
      findFirstLocalPlugin.mockRestore();
    });

    it('should do nothing if flex/plugins.json does not exist', () => {
      checkFilesExist.mockReturnValue(false);

      preScriptCheck._setPluginDir();

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith(cliJsonPath);
      expect(getCliPaths).toHaveBeenCalledTimes(1);
      expect(parseUserInputPlugins).not.toHaveBeenCalled();
    });

    it('should do nothing if no plugin is found', () => {
      checkFilesExist.mockReturnValue(true);
      parseUserInputPlugins.mockReturnValue([{ name: 'plugin', remote: false }]);
      findFirstLocalPlugin.mockReturnValue(undefined);

      preScriptCheck._setPluginDir();

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith(cliJsonPath);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(findFirstLocalPlugin).toHaveBeenCalledTimes(1);
      expect(setCwd).not.toHaveBeenCalled();
    });

    it('should do nothing if plugin is found but its directory is not', () => {
      checkFilesExist.mockImplementation((...p: string[]) => p.includes(cliJsonPath));
      parseUserInputPlugins.mockReturnValue([{ name: 'plugin', remote: false }]);
      findFirstLocalPlugin.mockReturnValue({ name: 'plugin', dir: pluginPath });

      preScriptCheck._setPluginDir();

      expect(checkFilesExist).toHaveBeenCalledTimes(2);
      expect(checkFilesExist).toHaveBeenCalledWith(cliJsonPath);
      expect(checkFilesExist).toHaveBeenCalledWith(pluginPath);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(findFirstLocalPlugin).toHaveBeenCalledTimes(1);
      expect(setCwd).not.toHaveBeenCalled();
    });

    it('should set directory', () => {
      checkFilesExist.mockReturnValue(true);
      parseUserInputPlugins.mockReturnValue([{ name: 'plugin', remote: false }]);
      findFirstLocalPlugin.mockReturnValue({ name: 'plugin', dir: pluginPath });

      preScriptCheck._setPluginDir();

      expect(checkFilesExist).toHaveBeenCalledTimes(2);
      expect(checkFilesExist).toHaveBeenCalledWith(cliJsonPath);
      expect(checkFilesExist).toHaveBeenCalledWith(pluginPath);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(findFirstLocalPlugin).toHaveBeenCalledTimes(1);
      expect(setCwd).toHaveBeenCalledTimes(1);
    });
  });

  describe('_comparePluginAndCLIVersions', () => {
    beforeEach(() => {
      jest.spyOn(fsScripts, 'readPackageJson').mockReturnValue({
        version: '1.0.0',
        name: '',
        dependencies: {
          '@twilio-labs/plugin-flex': '1.2.3',
        },
        devDependencies: {
          '@twilio/flex-ui': '^1',
        },
      });
    });

    it('should do nothing if the plugin and cli versions are the same', () => {
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.3');
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.3');

      preScriptCheck._comparePluginAndCLIVersions();

      expect(logger.warning).not.toHaveBeenCalled();
    });

    it('should log a warning if the flex-plugin-scripts version is less than CLI', () => {
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.4');
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.3');

      preScriptCheck._comparePluginAndCLIVersions();

      expect(logger.warning).toHaveBeenCalledTimes(1);
    });

    it('should log a warning if CLI version is less than flex-plugin-scripts', () => {
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.3');
      jest.spyOn(fsScripts, 'packageDependencyVersion').mockReturnValueOnce('1.2.4');

      preScriptCheck._comparePluginAndCLIVersions();

      expect(logger.warning).toHaveBeenCalledTimes(1);
    });
  });
});
