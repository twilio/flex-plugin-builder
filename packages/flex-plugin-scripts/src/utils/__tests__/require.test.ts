import { resolve } from '../require';

describe('require', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('resolve', () => {
    it('should resolve path', () => {
      jest.spyOn(process, 'cwd').mockReturnValue('testDir');

      const path = resolve('some-path');
      expect(path).toContain('testDir/node_modules/some-path');
    });
  });
});
