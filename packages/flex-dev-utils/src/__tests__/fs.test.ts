import { getPackageJsonPath, readPackageJson } from "../fs";
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
  });

  describe('checkFilesExist', () => {
    it('loop through all files', () => {
      // @ts-ignore
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockImplementation(() => {});

      fs.checkFilesExist('file1', 'file2');
      expect(existsSync).toHaveBeenCalledTimes(2);

      existsSync.mockRestore();
    });
  });

  describe('updatePackageVersion', () => {
    it('should update version', () => {
      const pkgBefore = {version: 1};
      // @ts-ignore
      const writeFileSync = jest.spyOn(fs.default, 'writeFileSync').mockImplementation(() => {});
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
});
