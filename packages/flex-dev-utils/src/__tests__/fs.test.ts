import appModule from 'app-module-path';
import * as globby from 'globby';

import * as fs from '../fs';
import * as inquirer from '../inquirer';

jest.mock('flex-plugins-utils-logger/dist/lib/inquirer');
jest.mock('globby');
jest.mock('app-module-path');

describe('fs', () => {
  const flexPluginScripts = 'flex-plugin-scripts';
  const flexPluginWebpack = 'flex-plugin-webpack';
  const flexPluginScriptsPath = `/path/to/${flexPluginScripts}`;
  const flexPluginWebpackPath = `/path/to/${flexPluginWebpack}`;
  const pluginName = 'plugin-test';
  const fileContent = '{"version":1}';

  const appPackage: fs.AppPackageJson = {
    version: '1',
    name: pluginName,
    dependencies: {
      [flexPluginScripts]: '1',
      'flex-plugin': '2',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('readPackageJson', () => {
    it('should read package.json', () => {
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockReturnValue(fileContent);

      const pkg = fs.readPackageJson('filePath');

      expect(pkg).toEqual({ version: 1 });
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('filePath', 'utf8');

      readFileSync.mockRestore();
    });
  });

  describe('readJsonFile', () => {
    it('should read package.json', () => {
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockReturnValue(fileContent);

      const pkg = fs.readJsonFile('filePath');

      expect(pkg).toEqual({ version: 1 });
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('filePath', 'utf8');

      readFileSync.mockRestore();
    });
  });

  describe('readAppPackageJson', () => {
    it('should read app package', () => {
      const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue(appPackage);
      const getPackageJsonPath = jest.spyOn(fs, 'getPackageJsonPath').mockReturnValue('path');

      const pkg = fs.readAppPackageJson();

      expect(pkg).toEqual(appPackage);
      expect(readPackageJson).toHaveBeenCalledTimes(1);
      expect(readPackageJson).toHaveBeenCalledWith('path');
      expect(getPackageJsonPath).toHaveBeenCalledTimes(1);

      readPackageJson.mockRestore();
      getPackageJsonPath.mockRestore();
    });
  });

  describe('getPackageJsonPath', () => {
    it('should return the right path', () => {
      const cwd = jest.spyOn(fs, 'getCwd').mockImplementation(() => 'test');

      const path = fs.getPackageJsonPath();

      expect(cwd).toHaveBeenCalledTimes(1);
      expect(path).toEqual('test/package.json');

      cwd.mockRestore();
    });

    it('should read custom path', () => {
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockImplementation(() => fileContent);

      const pkg = fs.readPackageJson('another-path');

      expect(pkg).toEqual({ version: 1 });
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('another-path', 'utf8');

      readFileSync.mockRestore();
    });
  });

  describe('checkFilesExist', () => {
    it('loop through all files', () => {
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation(() => {
        /* no-op */
      });

      fs.checkFilesExist('file1', 'file2');
      expect(existsSync).toHaveBeenCalledTimes(2);

      existsSync.mockRestore();
    });
  });

  describe('updateAppVersion', () => {
    it('should update version', () => {
      const pkgBefore = { ...appPackage };
      const pkgAfter: fs.PackageJson = { ...pkgBefore, version: '2' };

      // @ts-ignore
      const writeFileSync = jest.spyOn(fs.default, 'writeFileSync').mockImplementation(() => {
        /* no-op */
      });
      // @ts-ignore
      const getPackageJsonPath = jest.spyOn(fs, 'getPackageJsonPath').mockReturnValue('package.json');
      const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue(pkgBefore);

      fs.updateAppVersion('2');
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('package.json', JSON.stringify(pkgAfter, null, 2));

      writeFileSync.mockRestore();
      getPackageJsonPath.mockRestore();
      readPackageJson.mockRestore();
    });
  });

  describe('findUp', () => {
    const findUpDir = '/path1/path2/path3';
    const fileName = 'foo';

    it('should find on one up', () => {
      const path = '/path1/path2/path3/foo';
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation((p) => p === path);

      fs.findUp(findUpDir, fileName);

      expect(existsSync).toHaveBeenCalledTimes(1);

      existsSync.mockRestore();
    });

    it('should find on two up', () => {
      const path = '/path1/path2/foo';
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation((p) => p === path);

      fs.findUp(findUpDir, fileName);

      expect(existsSync).toHaveBeenCalledTimes(2);

      existsSync.mockRestore();
    });

    it('should fail if it reaches root directory', (done) => {
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation(() => false);

      try {
        fs.findUp(findUpDir, fileName);
      } catch (e) {
        done();
      }

      existsSync.mockRestore();
    });
  });

  describe('resolveCwd', () => {
    it('should call resolveRelative', () => {
      const resolveRelative = jest.spyOn(fs, 'resolveRelative').mockReturnValue('foo');

      expect(fs.resolveCwd('some-path')).toEqual('foo');
      expect(resolveRelative).toHaveBeenCalledTimes(1);
      expect(resolveRelative).toHaveBeenCalledWith(expect.any(String), 'some-path');

      resolveRelative.mockRestore();
    });
  });

  describe('resolveRelative', () => {
    it('should return dir if no paths passed', () => {
      expect(fs.resolveRelative('the-dir')).toEqual('the-dir');
    });

    it('should build path with single item and no extension', () => {
      expect(fs.resolveRelative('the-dir', 'the-sub')).toEqual('the-dir/the-sub');
    });

    it('should build path with single item that is extension', () => {
      expect(fs.resolveRelative('the-file', '.extension')).toEqual('the-file.extension');
    });

    it('should build path with two items and no extension', () => {
      expect(fs.resolveRelative('foo', 'bar', 'baz')).toEqual('foo/bar/baz');
    });

    it('should build path with two items and an extension', () => {
      expect(fs.resolveRelative('foo', 'bar', '.baz')).toEqual('foo/bar.baz');
    });

    it('should build path with multiple items and no extension', () => {
      expect(fs.resolveRelative('foo', 'bar', 'baz', 'test', 'it')).toEqual('foo/bar/baz/test/it');
    });

    it('should build path with multiple items and an extension', () => {
      expect(fs.resolveRelative('foo', 'bar', 'baz', 'test', '.it')).toEqual('foo/bar/baz/test.it');
    });
  });

  describe('findGlobsIn', () => {
    it('should call globby', () => {
      const dirs = ['path1', 'path2'];
      const sync = jest.spyOn(globby, 'sync').mockReturnValue(dirs);
      const patterns = ['pattern1', 'pattern2'];
      const result = fs.findGlobsIn('the-dir', ...patterns);

      expect(result).toEqual(dirs);
      expect(sync).toHaveBeenCalledTimes(1);
      expect(sync).toHaveBeenCalledWith(patterns, { cwd: 'the-dir' });
    });
  });

  describe('checkPluginConfigurationExists', () => {
    const pluginsJsonPath = 'test-dir-plugins';
    const name = pluginName;
    const dir = 'test-dir';
    const anotherDir = 'another-dir';
    const cliPath = {
      dir,
      flexDir: 'test-dir-flex',
      pluginsJsonPath,
    };

    let checkFilesExist = jest.spyOn(fs, 'checkFilesExist');
    let mkdirpSync = jest.spyOn(fs, 'mkdirpSync');
    let writeFileSync = jest.spyOn(fs.default, 'writeFileSync');
    let readJsonFile = jest.spyOn(fs, 'readJsonFile');
    let confirm = jest.spyOn(inquirer, 'confirm');
    let getCliPaths = jest.spyOn(fs, 'getCliPaths');

    beforeEach(() => {
      checkFilesExist = jest.spyOn(fs, 'checkFilesExist');
      mkdirpSync = jest.spyOn(fs, 'mkdirpSync');
      writeFileSync = jest.spyOn(fs.default, 'writeFileSync');
      readJsonFile = jest.spyOn(fs, 'readJsonFile');
      confirm = jest.spyOn(inquirer, 'confirm');
      getCliPaths = jest.spyOn(fs, 'getCliPaths');

      mkdirpSync.mockReturnThis();
      writeFileSync.mockReturnThis();
      readJsonFile.mockReturnValue({ plugins: [] });

      // @ts-ignore
      getCliPaths.mockReturnValue(cliPath);
    });

    it('make directories if not found', async () => {
      checkFilesExist.mockReturnValue(false);

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith(pluginsJsonPath);
      expect(mkdirpSync).toHaveBeenCalledTimes(1);
      expect(mkdirpSync).toHaveBeenCalledWith('test-dir-flex');
    });

    it('do nothing if directories are found', async () => {
      checkFilesExist.mockReturnValue(true);

      const result = await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith(pluginsJsonPath);
      expect(mkdirpSync).not.toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should add the plugin to plugins.json if not found', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({ plugins: [] });
      writeFileSync.mockReturnThis();

      const result = await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith(
        pluginsJsonPath,
        JSON.stringify({ plugins: [{ name: pluginName, dir, port: 0 }] }, null, 2),
      );
      expect(result).toEqual(true);
    });

    it('do nothing if plugin has same directory as an existing one', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({ plugins: [{ name: pluginName, dir, port: 0 }] });
      writeFileSync.mockReturnThis();

      const result = await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it('change file path if user confirms', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({ plugins: [{ name: pluginName, dir: anotherDir, port: 0 }] });
      writeFileSync.mockReturnThis();
      confirm.mockResolvedValue(true);

      const result = await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      // expect(confirm).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith(
        pluginsJsonPath,
        JSON.stringify({ plugins: [{ name: pluginName, dir, port: 0 }] }, null, 2),
      );
      expect(result).toEqual(true);
    });

    it('do not change file path, user did not confirm', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({ plugins: [{ name: pluginName, dir: anotherDir, port: 0 }] });
      writeFileSync.mockReturnThis();
      confirm.mockResolvedValue(false);

      const result = await fs.checkPluginConfigurationExists(name, dir, true);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(writeFileSync).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    });
  });

  describe('_getFlexPluginScripts', () => {
    it('should resolve path', () => {
      const thePath = 'the/path';
      const resolveModulePath = jest.spyOn(fs, 'resolveModulePath').mockReturnValue(thePath);

      fs._getFlexPluginScripts();

      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith(flexPluginScripts);
    });

    it('should throw exception if package not found', (done) => {
      jest.spyOn(fs, 'resolveModulePath').mockReturnValue(false);

      try {
        fs._getFlexPluginScripts();
      } catch (e) {
        expect(e.message).toContain(`resolve ${flexPluginScripts}`);
        done();
      }
    });
  });

  describe('_getFlexPluginWebpackPath', () => {
    it('should resolve path', () => {
      const thePath = 'the/path';
      const theModule = 'the/module';
      const resolveModulePath = jest.spyOn(fs, 'resolveModulePath').mockReturnValue(thePath);

      fs._getFlexPluginWebpackPath(theModule);

      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith(flexPluginWebpack, theModule);
    });

    it('should throw exception if package not found', (done) => {
      jest.spyOn(fs, 'resolveModulePath').mockReturnValue(false);

      try {
        fs._getFlexPluginWebpackPath('path');
      } catch (e) {
        expect(e.message).toContain(`resolve ${flexPluginWebpack}`);
        done();
      }
    });
  });

  describe('getPaths', () => {
    const validPackage = {
      name: pluginName,
      version: '1.2.3',
      dependencies: {
        [flexPluginScripts]: '1',
        'flex-plugin': '2',
      },
    };

    it('should give cli paths', () => {
      const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue(validPackage);

      // cli/ directory
      expect(fs.getCliPaths().dir).toEqual(expect.stringMatching('/.twilio-cli'));
      expect(fs.getCliPaths().flexDir).toContain('/.twilio-cli/flex');
      expect(fs.getCliPaths().pluginsJsonPath).toEqual(expect.stringMatching('plugins.json'));

      readPackageJson.mockRestore();
    });

    it('should throw exception if flexPluginScriptPath is not found', (done) => {
      jest.spyOn(fs, 'resolveModulePath').mockImplementation((pkg) => {
        if (pkg === flexPluginScripts) {
          return false;
        }

        return pkg;
      });

      try {
        fs.getPaths();
      } catch (e) {
        expect(e.message).toContain(`resolve ${flexPluginScripts}`);
        done();
      }
    });

    it('should throw exception if flexPluginWebpackPath is not found', (done) => {
      jest.spyOn(fs, 'resolveModulePath').mockImplementation((pkg) => {
        if (pkg === flexPluginWebpack) {
          return false;
        }

        return pkg;
      });

      try {
        fs.getPaths();
      } catch (e) {
        expect(e.message).toContain(`resolve ${flexPluginWebpack}`);
        done();
      }
    });

    it('should give you the paths', () => {
      const _getFlexPluginScripts = jest.spyOn(fs, '_getFlexPluginScripts').mockReturnValue(flexPluginScriptsPath);
      const _getFlexPluginWebpackPath = jest
        .spyOn(fs, '_getFlexPluginWebpackPath')
        .mockReturnValue(flexPluginWebpackPath);
      const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue(validPackage);
      const thePaths = fs.getPaths();

      expect(_getFlexPluginScripts).toHaveBeenCalledTimes(1);
      expect(_getFlexPluginWebpackPath).toHaveBeenCalledTimes(1);

      // build/ directory
      expect(thePaths.app.buildDir).toEqual(expect.stringMatching('build$'));
      expect(thePaths.app.bundlePath).toContain('build');
      expect(thePaths.app.bundlePath).toContain(validPackage.name);
      expect(thePaths.app.bundlePath).toEqual(expect.stringMatching('.js$'));
      expect(thePaths.app.sourceMapPath).toContain('build');
      expect(thePaths.app.sourceMapPath).toContain(validPackage.name);
      expect(thePaths.app.sourceMapPath).toEqual(expect.stringMatching('.js.map$'));

      // cli/ directory
      expect(thePaths.cli.dir).toEqual(expect.stringMatching('/.twilio-cli'));
      expect(thePaths.cli.flexDir).toContain('/.twilio-cli/flex');
      expect(thePaths.cli.pluginsJsonPath).toEqual(expect.stringMatching('plugins.json'));

      // src/ directory
      expect(thePaths.app.srcDir).toEqual(expect.stringMatching('src$'));
      expect(thePaths.app.entryPath).toContain('src');
      expect(thePaths.app.entryPath).toEqual(expect.stringMatching('index$'));

      // node_modules/ directory
      expect(thePaths.app.nodeModulesDir).toEqual(expect.stringMatching('node_modules$'));
      expect(thePaths.app.flexUIDir).toContain('node_modules');
      expect(thePaths.app.flexUIDir).toContain('@twilio/flex-ui');
      expect(thePaths.app.flexUIPkgPath).toContain('@twilio/flex-ui');
      expect(thePaths.app.flexUIPkgPath).toEqual(expect.stringMatching('package.json$'));

      // scripts
      expect(thePaths.scripts.devAssetsDir).toContain(flexPluginScriptsPath);

      // public/ directory
      expect(thePaths.app.publicDir).toEqual(expect.stringMatching('public$'));
      expect(thePaths.app.appConfig).toEqual(expect.stringMatching('appConfig.js$'));

      // env support
      expect(thePaths.app.envPath).toEqual(expect.stringMatching('.env'));
      expect(thePaths.app.envExamplePath).toEqual(expect.stringMatching('.env.example'));
      expect(thePaths.app.envDefaultsPath).toEqual(expect.stringMatching('.env.defaults'));

      // dependencies
      expect(thePaths.app.dependencies.react.version).toEqual('1.2.3');
      expect(thePaths.app.dependencies.reactDom.version).toEqual('1.2.3');
      expect(thePaths.app.dependencies.flexUI.version).toEqual('1.2.3');

      // package.json
      expect(thePaths.app.name).toEqual(pluginName);
      expect(thePaths.app.version).toEqual('1.2.3');

      // typescript
      expect(thePaths.app.tsConfigPath).toContain('tsconfig.json');
      expect(thePaths.app.isTSProject()).toEqual(true);

      // setup tests
      expect(thePaths.app.setupTestsPaths).toHaveLength(2);
      expect(thePaths.app.setupTestsPaths[0]).toContain('setupTests.js');
      expect(thePaths.app.setupTestsPaths[0]).not.toContain('src');
      expect(thePaths.app.setupTestsPaths[1]).toContain('setupTests.js');
      expect(thePaths.app.setupTestsPaths[1]).toContain('src');

      // webpack
      expect(thePaths.webpack.dir).toContain(flexPluginWebpackPath);
      expect(thePaths.webpack.nodeModulesDir).toContain(flexPluginWebpackPath);
      expect(thePaths.webpack.nodeModulesDir).toContain('node_modules');

      // others
      expect(thePaths.assetBaseUrlTemplate).toContain('plugin-test/%PLUGIN_VERSION%');

      readPackageJson.mockRestore();
    });
  });

  describe('setCoreCwd', () => {
    it('should set the core cwd', () => {
      const cwd = '/new/path';
      const before = fs.getCoreCwd();
      fs.setCoreCwd(cwd);
      const after = fs.getCoreCwd();

      expect(after).toEqual(cwd);
      expect(before).not.toEqual(after);
    });
  });

  describe('setCwd', () => {
    it('should set the cwd', () => {
      const cwd = '/new/path';
      const before = fs.getCwd();
      fs.setCwd(cwd);
      const after = fs.getCwd();

      expect(after).toEqual(cwd);
      expect(before).not.toEqual(after);
    });
  });

  describe('addCWDNodeModule', () => {
    it('should add path', () => {
      const addPath = jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      fs.addCWDNodeModule();
      expect(setCoreCwd).not.toHaveBeenCalled();
      expect(addPath).toHaveBeenCalledTimes(1);
      expect(addPath).toHaveBeenCalledWith(expect.stringContaining('node_modules'));
    });

    it('should add core-cwd', () => {
      const cwd = '/new/path';
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      fs.addCWDNodeModule('--core-cwd', cwd);
      expect(setCoreCwd).toHaveBeenCalledTimes(1);
      expect(setCoreCwd).toHaveBeenCalledWith(cwd);
    });

    it('should not add core-cwd if not provided', () => {
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      fs.addCWDNodeModule('--core-cwd');
      expect(setCoreCwd).not.toHaveBeenCalled();
    });

    it('should add cwd', () => {
      const cwd = '/new/path';
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCwd = jest.spyOn(fs, 'setCwd').mockReturnThis();

      fs.addCWDNodeModule('--cwd', cwd);
      expect(setCwd).toHaveBeenCalledTimes(1);
      expect(setCwd).toHaveBeenCalledWith(cwd);
    });

    it('should not add cwd if not provided', () => {
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCwd = jest.spyOn(fs, 'setCwd').mockReturnThis();

      fs.addCWDNodeModule('--cwd');
      expect(setCwd).not.toHaveBeenCalled();
    });
  });

  describe('resolveModulePath', () => {
    it('should find path', () => {
      expect(fs.resolveModulePath('jest')).toContain('jest');
    });

    it('should not find path', () => {
      expect(fs.resolveModulePath('random-unknown-package')).toEqual(false);
    });
  });

  describe('findGlobs', () => {
    it('should return all globs', () => {
      const findGlobsIn = jest.spyOn(fs, 'findGlobsIn').mockReturnValue(['glob']);
      const getCwd = jest.spyOn(fs, 'getCwd').mockReturnValue('/the/cwd');
      const result = fs.findGlobs('pattern1', 'pattern2');

      expect(result).toEqual(['glob']);
      expect(getCwd).toHaveBeenCalledTimes(1);
      expect(findGlobsIn).toHaveBeenCalledTimes(1);
      expect(findGlobsIn).toHaveBeenCalledWith('/the/cwd/src', 'pattern1', 'pattern2');
    });
  });
});
