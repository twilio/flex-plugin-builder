import { RequiredFlagError } from '@oclif/parser/lib/errors';
import { TwilioCliError } from '@twilio/flex-dev-utils';

import FlexPluginsRelease from '../../../../commands/flex/plugins/release';
import CreateConfiguration from '../../../../sub-commands/create-configuration';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import createTest from '../../../framework';

describe('Commands/FlexPluginsRelease', () => {
  const name = 'plugin-one';
  const description = 'Releasing plugin-one';
  const plugin = 'plugin-one@1.0.0';
  const configurationSid = '1234567890';

  it('should have own flags', () => {
    expect(FlexPluginsRelease.flags).not.toBeSameObject(CreateConfiguration.flags);
    expect(FlexPluginsRelease.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createTest(FlexPluginsRelease)('--name', name, '--plugin', plugin, '--description', description);
    await cmd.init();
    expect(cmd._flags).toBeDefined();
  });

  it('should return parsed flags if required flags not present but configuration sid is present', async () => {
    const cmd = await createTest(FlexPluginsRelease)('--configuration-sid', configurationSid);
    jest.spyOn(cmd, 'doCreateRelease').mockResolvedValue();
    await cmd.init();
    await cmd.doRun();
    expect(cmd._flags).toBeDefined();
  });
});
