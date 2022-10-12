import { TwilioCliError } from '@twilio/flex-dev-utils';

import FlexPluginsDescribePluginVersion from '../../../../../commands/flex/plugins/describe/plugin-version';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import createTest from '../../../../framework';

describe('Commands/Describe/FlexPluginsDescribePluginVersion', () => {
  it('should have own flags', () => {
    expect(FlexPluginsDescribePluginVersion.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsDescribePluginVersion.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createTest(FlexPluginsDescribePluginVersion)('--name', 'plugin-one', '--version', '1.0.2');
    await cmd.init();
    expect(cmd._flags).toBeDefined();
  });
});
