import { AppPackageJson, PackageJson } from '../fs';
import * as fs from '../fs';
import * as globby from 'globby';

jest.mock('globby');

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
});
