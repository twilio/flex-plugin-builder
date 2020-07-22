import * as requireScripts from '../require';
import appModule from 'app-module-path';
import * as fs from '../fs';

jest.mock('app-module-path');

describe('require', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('addCWDNodeModule', () => {
    it('should add path', () => {
      const addPath = jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      requireScripts.addCWDNodeModule();
      expect(setCoreCwd).not.toHaveBeenCalled();
      expect(addPath).toHaveBeenCalledTimes(1);
      expect(addPath).toHaveBeenCalledWith(expect.stringContaining('node_modules'));
    });

    it('should add core-cwd', () => {
      const cwd = '/new/path';
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      requireScripts.addCWDNodeModule('--core-cwd', cwd);
      expect(setCoreCwd).toHaveBeenCalledTimes(1);
      expect(setCoreCwd).toHaveBeenCalledWith(cwd);
    });

    it('should not add core-cwd if not provided', () => {
      jest.spyOn(appModule, 'addPath').mockReturnThis();
      const setCoreCwd = jest.spyOn(fs, 'setCoreCwd').mockReturnThis();

      requireScripts.addCWDNodeModule('--core-cwd');
      expect(setCoreCwd).not.toHaveBeenCalled();
    });
  });

  describe('resolveModulePath', () => {
    it('should find path', () => {
      expect(requireScripts.resolveModulePath('jest')).toContain('jest');
    });

    it('should not find path', () => {
      expect(requireScripts.resolveModulePath('random-unknown-package')).toEqual(false);
    });
  });
});
