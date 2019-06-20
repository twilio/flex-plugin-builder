import * as fs from '../fs';

describe('fs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readPackageJson', () => {
    it('should read package.json', () => {
      const str = '{"version":1}';
      const cwd = jest.spyOn(process, 'cwd').mockImplementation(() => 'test');
      const readFileSync = jest.spyOn(fs.default, 'readFileSync').mockImplementation(() => str);

      const pkg = fs.readPackageJson();

      expect(pkg).toEqual({version: 1});
      expect(cwd).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith('test/package.json', 'utf8');

      cwd.mockRestore();
      readFileSync.mockRestore();
    });
  });

  describe('getPackageJsonPath', () => {
    it('should return the right path', () => {
      const cwd = jest.spyOn(process, 'cwd').mockImplementation(() => 'test');

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

  describe('updatePackageVersion', () => {
    it('should update version', () => {
      const pkgBefore = {version: 1};
      // @ts-ignore
      const writeFileSync = jest.spyOn(fs.default, 'writeFileSync').mockImplementation(() => { /* no-op */ });
      // @ts-ignore
      const getPackageJsonPath = jest.spyOn(fs, 'getPackageJsonPath').mockImplementation(() => 'package.json');
      const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockImplementation(() => pkgBefore);

      fs.updatePackageVersion('2');
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('package.json', JSON.stringify({version: '2'}, null, 2));

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
});
