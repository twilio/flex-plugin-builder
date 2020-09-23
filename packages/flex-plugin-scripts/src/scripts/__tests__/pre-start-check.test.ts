import * as preStartCheck from '../pre-start-check';

describe('PreStartCheck', () => {
  describe('main', () => {
    const _checkAppConfig = jest.spyOn(preStartCheck, '_checkAppConfig');

    beforeEach(() => {
      _checkAppConfig.mockReset();

      _checkAppConfig.mockReturnThis();
    });

    afterAll(() => {
      _checkAppConfig.mockRestore();
    });

    it('should call all methods', async () => {
      await preStartCheck.default();

      expect(_checkAppConfig).toHaveBeenCalledTimes(1);
    });
  });
})
