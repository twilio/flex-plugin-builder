import fs from 'fs';

import * as fsScripts from 'flex-dev-utils/dist/fs';

import * as prints from '../../prints';
import * as preScriptCheck from '../pre-script-check';
import * as parser from '../../utils/parser';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../prints/versionMismatch');
jest.mock('../../prints/unbundledReactMismatch');
jest.mock('../../prints/expectedDependencyNotFound');
jest.mock('../../prints/typescriptNotInstalled');
jest.mock('../../prints/loadPluginCountError');

describe('PreScriptCheck', () => {
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
      name: 'plugin-test',
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
    const cwd = jest.spyOn(process, 'cwd');

    beforeEach(() => {
      _checkExternalDepsVersions.mockReset();
      _validateTypescriptProject.mockReset();
      _checkPluginCount.mockReset();
      checkPluginConfigurationExists.mockReset();
      _setPluginDir.mockReset();
      cwd.mockReset();

      _checkExternalDepsVersions.mockReturnThis();
      _validateTypescriptProject.mockReturnValue(undefined);
      _checkPluginCount.mockReturnValue(undefined);
      checkPluginConfigurationExists.mockReturnThis();
      _setPluginDir.mockReturnThis();
      cwd.mockReturnValue('/path/to/plugin-dir');
    });

    afterAll(() => {
      _checkExternalDepsVersions.mockRestore();
      _validateTypescriptProject.mockRestore();
      _checkPluginCount.mockRestore();
      checkPluginConfigurationExists.mockRestore();
      _setPluginDir.mockRestore();
      cwd.mockRestore();
    });

    const expectCalled = (allowSkip: boolean, allowReact: boolean) => {
      expect(_checkExternalDepsVersions).toHaveBeenCalledTimes(1);
      expect(_validateTypescriptProject).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledWith(allowSkip, allowReact);
      expect(_checkPluginCount).toHaveBeenCalledTimes(1);
      expect(checkPluginConfigurationExists).toHaveBeenCalledTimes(1);
    };

    it('should call all methods', async () => {
      await preScriptCheck.default();

      expectCalled(false, false);
      expect(checkPluginConfigurationExists).toHaveBeenCalledWith('plugin-dir', '/path/to/plugin-dir', false);
      expect(_setPluginDir).toHaveBeenCalledTimes(2);
    });

    it('should call with multi-plugin flag', async () => {
      await preScriptCheck.default(preScriptCheck.FLAG_MULTI_PLUGINS);

      expectCalled(false, false);
      expect(checkPluginConfigurationExists).toHaveBeenCalledWith('plugin-dir', '/path/to/plugin-dir', true);
      expect(_setPluginDir).toHaveBeenCalledTimes(2);
    });

    it('should call all methods and allow skip', async () => {
      process.env.SKIP_PREFLIGHT_CHECK = 'true';
      await preScriptCheck.default();

      expectCalled(true, false);
    });

    it('should call all methods and allow react', async () => {
      process.env.UNBUNDLED_REACT = 'true';
      await preScriptCheck.default();

      expectCalled(false, true);
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

    it('should quit if expected dependency is not found', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: {},
      };
      preScriptCheck._verifyPackageVersion(pkg, false, false, 'foo');

      expect(prints.expectedDependencyNotFound).toHaveBeenCalledTimes(1);
      expect(prints.expectedDependencyNotFound).toHaveBeenCalledWith('foo');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(_require).not.toHaveBeenCalled();
    });

    it('should warn about version mismatch and quit', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { somePackage: '2.0.0' },
      };
      _require.mockReturnValue({ version: '1.0.0' });

      preScriptCheck._verifyPackageVersion(pkg, false, false, 'somePackage');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('somePackage', '1.0.0', '2.0.0', false);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should warn about version mismatch but not quit', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { somePackage: '2.0.0' },
      };
      _require.mockReturnValue({ version: '1.0.0' });

      preScriptCheck._verifyPackageVersion(pkg, true, false, 'somePackage');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('somePackage', '1.0.0', '2.0.0', true);
      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should find no conflict with pinned dependency', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { somePackage: '1.0.0' },
      };
      _require.mockReturnValue({ version: '1.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, false, 'somePackage');

      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should find no conflict with unpinned dependency', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { somePackage: `^1.0.0` },
      };
      _require.mockReturnValue({ version: '1.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, false, 'somePackage');

      expect(exit).not.toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should warn if allowReact but unsupported flex-ui', () => {
      const pkg = {
        version: '1.18.0',
        dependencies: { somePackage: `1.0.0` },
      };
      _require.mockReturnValue({ version: '2.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, true, 'somePackage');

      expect(prints.unbundledReactMismatch).toHaveBeenCalledTimes(1);
      expect(prints.unbundledReactMismatch).toHaveBeenCalledWith('1.18.0', 'somePackage', '2.0.0', false);
      expect(prints.versionMismatch).not.toHaveBeenCalled();
      expect(exit).toHaveBeenCalled();
      expect(_require).toHaveBeenCalledTimes(1);
      expect(_require).toHaveBeenCalledWith(expect.stringContaining('somePackage'));
    });

    it('should warn if allowReact', () => {
      const pkg = {
        version: '1.19.0',
        dependencies: { somePackage: `1.0.0` },
      };
      _require.mockReturnValue({ version: '2.0.0' });
      preScriptCheck._verifyPackageVersion(pkg, false, true, 'somePackage');

      expect(prints.unbundledReactMismatch).not.toHaveBeenCalled();
      expect(prints.versionMismatch).not.toHaveBeenCalled();
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
      _readIndexPage.mockReturnValue('blahblah\nFlexPlugin.loadPlugin\nblahblah');
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
      _readIndexPage.mockReturnValue('blahblah\nloadPlugin\nloadPlugin\nloadPlugin\nblahblah');
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
      findFirstLocalPlugin.mockReturnValue({ name: 'plugin', dir: pluginPath, port: 0 });

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
      findFirstLocalPlugin.mockReturnValue({ name: 'plugin', dir: pluginPath, port: 0 });

      preScriptCheck._setPluginDir();

      expect(checkFilesExist).toHaveBeenCalledTimes(2);
      expect(checkFilesExist).toHaveBeenCalledWith(cliJsonPath);
      expect(checkFilesExist).toHaveBeenCalledWith(pluginPath);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(findFirstLocalPlugin).toHaveBeenCalledTimes(1);
      expect(setCwd).toHaveBeenCalledTimes(1);
    });
  });
});
