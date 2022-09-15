import FlexPluginsDescribeRelease from '../../../../../commands/flex/plugins/describe/release';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/Describe/FlexPluginsDescribeRelease', () => {
  it('should have own flags', () => {
    expect(FlexPluginsDescribeRelease.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsDescribeRelease.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
