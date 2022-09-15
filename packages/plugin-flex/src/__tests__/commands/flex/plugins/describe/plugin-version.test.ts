import FlexPluginsDescribePluginVersion from '../../../../../commands/flex/plugins/describe/plugin-version';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/Describe/FlexPluginsDescribePluginVersion', () => {
  it('should have own flags', () => {
    expect(FlexPluginsDescribePluginVersion.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsDescribePluginVersion.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
