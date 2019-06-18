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
});
