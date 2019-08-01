import { loadFile } from '../fs';

describe('fs', () => {
  describe('loadFile', () => {
    it('should find file', () => {
      const pkg = loadFile(process.cwd(), 'packages/craco-config-flex-plugin/package.json');
      expect(pkg.name).toEqual('craco-config-flex-plugin');
    });

    it('should not find file', () => {
      const pkg = loadFile(process.cwd(), 'packages/foo/package.json');
      expect(pkg).toBeNull();
    });
  });
});
