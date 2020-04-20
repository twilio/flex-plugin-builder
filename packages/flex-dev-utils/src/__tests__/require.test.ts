import * as requireScripts from '../require';
import appModule from 'app-module-path';

jest.mock('app-module-path');

describe('require', () => {
  describe('addCWDNodeModule', () => {
    it('should add path', () => {
      const addPath = jest.spyOn(appModule, 'addPath').mockReturnThis();

      requireScripts.addCWDNodeModule();
      expect(addPath).toHaveBeenCalledTimes(1);
      expect(addPath).toHaveBeenCalledWith(expect.stringContaining('node_modules'));

      addPath.mockRestore();
    });
  });
});
