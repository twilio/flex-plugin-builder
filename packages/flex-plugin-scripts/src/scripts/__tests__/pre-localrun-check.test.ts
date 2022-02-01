import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';

import * as preLocalRunCheck from '../pre-localrun-check';

describe('PreLocalRunCheck', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('main', () => {
    const _checkRunPluginConfigurationExists = jest.spyOn(fsScripts, 'checkRunPluginConfigurationExists');

    beforeEach(() => {
      _checkRunPluginConfigurationExists.mockReset();

      _checkRunPluginConfigurationExists.mockReturnThis();
    });

    afterAll(() => {
      _checkRunPluginConfigurationExists.mockRestore();
    });

    it('should call all methods', async () => {
      await preLocalRunCheck.default();

      expect(_checkRunPluginConfigurationExists).toHaveBeenCalledTimes(1);
    });
  });
});
