import { TwilioCliError } from '@twilio/flex-dev-utils';

import FlexPluginsListPluginVersions from '../../../../../commands/flex/plugins/list/plugin-versions';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import createTest from '../../../../framework';

describe('Commands/List/FlexPluginsListPluginVersions', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListPluginVersions.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListPluginVersions.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createTest(FlexPluginsListPluginVersions)('--name', 'plugin-one');
    await cmd.init();
    expect(cmd._flags).toBeDefined();
  });
});
