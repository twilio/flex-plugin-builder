import FlexPluginsDescribePlugin from '../../../../../commands/flex/plugins/describe/plugin';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/Describe/FlexPluginsDescribePlugin', () => {
  it('should have own flags', () => {
    expect(FlexPluginsDescribePlugin.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsDescribePlugin.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
