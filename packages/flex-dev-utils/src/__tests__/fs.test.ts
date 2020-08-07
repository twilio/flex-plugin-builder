import { AppPackageJson, PackageJson } from '../fs';
import appModule from 'app-module-path';
import * as fs from '../fs';
import * as globby from 'globby';
import * as inquirer from '../inquirer';

jest.mock('globby');
jest.mock('app-module-path');

describe('fs', () => {
  const appPackage: AppPackageJson = {
    version: '1',
    name: 'plugin-test',
    dependencies: {
      'flex-plugin-scripts': '1',
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
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockReturnValue('{"version":1}');

      const pkg = fs.readPackageJson('filePath');

      expect(pkg).toEqual({version: 1});
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('filePath', 'utf8');

      readFileSync.mockRestore();
    });
  });

  describe('readJsonFile', () => {
    it('should read package.json', () => {
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockReturnValue('{"version":1}');

      const pkg = fs.readJsonFile('filePath');

      expect(pkg).toEqual({version: 1});
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
      const str = '{"version":1}';
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockImplementation(() => str);

      const pkg = fs.readPackageJson('another-path');

      expect(pkg).toEqual({version: 1});
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('another-path', 'utf8');

      readFileSync.mockRestore();
    });
  });

  describe('checkFilesExist', () => {
    it('loop through all files', () => {
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation(() => { /* no-op */ });

      fs.checkFilesExist('file1', 'file2');
      expect(existsSync).toHaveBeenCalledTimes(2);

      existsSync.mockRestore();
    });
  });

  describe('updateAppVersion', () => {
    it('should update version', () => {
      const pkgBefore = {...appPackage};
      const pkgAfter: PackageJson = Object.assign({}, pkgBefore, {version: '2'});

      // @ts-ignore
      const writeFileSync = jest.spyOn(fs.default, 'writeFileSync').mockImplementation(() => { /* no-op */ });
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
    it('should find on one up', () => {
      const path = '/path1/path2/path3/foo';
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation((p) => p === path);

      fs.findUp('/path1/path2/path3', 'foo');

      expect(existsSync).toHaveBeenCalledTimes(1);

      existsSync.mockRestore();
    });

    it('should find on two up', () => {
      const path = '/path1/path2/foo';
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation((p) => p === path);

      fs.findUp('/path1/path2/path3', 'foo');

      expect(existsSync).toHaveBeenCalledTimes(2);

      existsSync.mockRestore();
    });

    it('should fail if it reaches root directory', (done) => {
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation(() => false);

      try {
        fs.findUp('/path1/path2/path3', 'foo');
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
    const name = 'plugin-test';
    const dir = 'test-dir';
    const cliPath = {
      dir: 'test-dir',
      flexDir: 'test-dir-flex',
      pluginsJsonPath: 'test-dir-plugins',
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
      readJsonFile.mockReturnValue({'plugins': []});

      // @ts-ignore
      getCliPaths.mockReturnValue(cliPath);
    });

    it('make directories if not found', async () => {
      checkFilesExist.mockReturnValue(false);

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith('test-dir-plugins');
      expect(mkdirpSync).toHaveBeenCalledTimes(1);
      expect(mkdirpSync).toHaveBeenCalledWith('test-dir-flex');
    });

    it('do nothing if directories are found', async () => {
      checkFilesExist.mockReturnValue(true);

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).toHaveBeenCalledWith('test-dir-plugins');
      expect(mkdirpSync).not.toHaveBeenCalled();
    });

    it('should add the plugin to plugins.json if not found', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({'plugins': []});
      writeFileSync.mockReturnThis();

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('test-dir-plugins', JSON.stringify({'plugins': [{name: 'plugin-test', dir: 'test-dir', port: 0}]}, null, 2));
    });

    it('do nothing if plugin has same directory as an existing one', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({'plugins': [{name: 'plugin-test', dir: 'test-dir', port: 0}]});
      writeFileSync.mockReturnThis();

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it('change file path if user confirms', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({'plugins': [{name: 'plugin-test', dir: 'test-dirr', port: 0}]});
      writeFileSync.mockReturnThis();
      confirm.mockResolvedValue(true);

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('test-dir-plugins', JSON.stringify({'plugins': [{name: 'plugin-test', dir: 'test-dir', port: 0}]}, null, 2));
    });

    it('do not change file path, user did not confirm', async () => {
      checkFilesExist.mockReturnValue(true);
      readJsonFile.mockReturnValue({'plugins': [{name: 'plugin-test', dir: 'test-dirr', port: 0}]});
      writeFileSync.mockReturnThis();
      confirm.mockResolvedValue(false);

      await fs.checkPluginConfigurationExists(name, dir);

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('getPaths', () => {
    const validPackage = {
      name: 'plugin-test',
      version: '1.2.3',
      dependencies: {
        'flex-plugin-scripts': '1',
        'flex-plugin': '2'
      },
    };

    it('should give cli paths', () => {
      const readPackageJson = jest
        .spyOn(fs, 'readPackageJson')
        .mockReturnValue(validPackage);

      // cli/ directory
      expect(fs.getCliPaths().dir).toEqual(expect.stringMatching('/.twilio-cli'));
      expect(fs.getCliPaths().flexDir).toContain('/.twilio-cli/flex');
      expect(fs.getCliPaths().pluginsJsonPath).toEqual(expect.stringMatching('plugins.json'));

      readPackageJson.mockRestore();
    });

    it('should give you the paths', () => {
      const readPackageJson = jest
        .spyOn(fs, 'readPackageJson')
        .mockReturnValue(validPackage);

      // build/ directory
      expect(fs.getPaths().app.buildDir).toEqual(expect.stringMatching('build$'));
      expect(fs.getPaths().app.bundlePath).toContain('build');
      expect(fs.getPaths().app.bundlePath).toContain(validPackage.name);
      expect(fs.getPaths().app.bundlePath).toEqual(expect.stringMatching('\.js$'));
      expect(fs.getPaths().app.sourceMapPath).toContain('build');
      expect(fs.getPaths().app.sourceMapPath).toContain(validPackage.name);
      expect(fs.getPaths().app.sourceMapPath).toEqual(expect.stringMatching('\.js\.map$'));

      // cli/ directory
      expect(fs.getPaths().cli.dir).toEqual(expect.stringMatching('/.twilio-cli'));
      expect(fs.getPaths().cli.flexDir).toContain('/.twilio-cli/flex');
      expect(fs.getPaths().cli.pluginsJsonPath).toEqual(expect.stringMatching('plugins.json'));

      // src/ directory
      expect(fs.getPaths().app.srcDir).toEqual(expect.stringMatching('src$'));
      expect(fs.getPaths().app.entryPath).toContain('src');
      expect(fs.getPaths().app.entryPath).toEqual(expect.stringMatching('index$'));

      // node_modules/ directory
      expect(fs.getPaths().app.nodeModulesDir).toEqual(expect.stringMatching('node_modules$'));
      expect(fs.getPaths().app.flexUIDir).toContain('node_modules');
      expect(fs.getPaths().app.flexUIDir).toContain('@twilio/flex-ui');
      expect(fs.getPaths().app.flexUIPkgPath).toContain('@twilio/flex-ui');
      expect(fs.getPaths().app.flexUIPkgPath).toEqual(expect.stringMatching('package\.json$'));

      // scripts
      expect(fs.getPaths().scripts.devAssetsDir).toContain('flex-plugin-scripts');

      // public/ directory
      expect(fs.getPaths().app.publicDir).toEqual(expect.stringMatching('public$'));
      expect(fs.getPaths().app.appConfig).toEqual(expect.stringMatching('appConfig\.js$'));
      expect(fs.getPaths().app.pluginsJsonPath).toEqual(expect.stringMatching('plugins\.json$'));

      // package.json
      expect(fs.getPaths().app.name).toEqual('plugin-test');
      expect(fs.getPaths().app.version).toEqual('1.2.3');

      // typescript
      expect(fs.getPaths().app.tsConfigPath).toContain('tsconfig.json');
      expect(fs.getPaths().app.isTSProject()).toEqual(true);

      // setup tests
      expect(fs.getPaths().app.setupTestsPaths).toHaveLength(2);
      expect(fs.getPaths().app.setupTestsPaths[0]).toContain('setupTests.js');
      expect(fs.getPaths().app.setupTestsPaths[0]).not.toContain('src');
      expect(fs.getPaths().app.setupTestsPaths[1]).toContain('setupTests.js');
      expect(fs.getPaths().app.setupTestsPaths[1]).toContain('src');

      // others
      expect(fs.getPaths().assetBaseUrlTemplate).toContain('plugin-test/%PLUGIN_VERSION%');

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
  });

  describe('resolveModulePath', () => {
    it('should find path', () => {
      expect(fs.resolveModulePath('jest')).toContain('jest');
    });

    it('should not find path', () => {
      expect(fs.resolveModulePath('random-unknown-package')).toEqual(false);
    });
  });
});
