import { TwilioCliError } from '@twilio/flex-dev-utils';

import FlexPluginsDescribeRelease from '../../../../../commands/flex/plugins/describe/release';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import createTest from '../../../../framework';

describe('Commands/Describe/FlexPluginsDescribeRelease', () => {
  const sid = '1234567890';
  const createCommand = async (...args: string[]): Promise<FlexPluginsDescribeRelease> => {
    const cmd = await createTest(FlexPluginsDescribeRelease)(...args);
    await cmd.init();
    return cmd;
  };

  it('should have own flags', () => {
    expect(FlexPluginsDescribeRelease.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsDescribeRelease.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createCommand('--sid', sid);
    expect(cmd._flags).toBeDefined();
  });
});
