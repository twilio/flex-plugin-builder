import { baseCommands } from '@twilio/cli-core';
import { ConfigData } from '@twilio/cli-core/src/services/config';
import * as createFlexPlugin from '@twilio/create-flex-plugin/dist/lib/cli';

import FlexPluginsCreate from '../../../../commands/flex/plugins/create';
import { SecureStorage } from '../../../../sub-commands/flex-plugin';
import { constants } from '../../../framework';

const secureStorage: SecureStorage = {
  getCredentials: jest.fn().mockImplementation((id: string) => ({
    apiKey: constants.FAKE_API_KEY,
    apiSecret: constants.FAKE_API_SECRET + id,
  })),
  saveCredentials: jest.fn().mockResolvedValue(true),
  storageLocation: 'libsecret',
};

describe('Commands/FlexPluginsCreate', () => {
  it('should have own flags', () => {
    expect(FlexPluginsCreate.flags).not.toBeSameObject(baseCommands.TwilioClientCommand.flags);
  });
  it('should run the command', async () => {
    const cmd = new FlexPluginsCreate(['plugin-sample-one'], ConfigData, secureStorage);
    // @ts-ignore
    const spy = jest.spyOn(createFlexPlugin, 'default').mockReturnValue({
      parse: jest.fn().mockResolvedValue(true),
    });
    await cmd.run();
    expect(spy).toHaveBeenCalled();
  });
});
