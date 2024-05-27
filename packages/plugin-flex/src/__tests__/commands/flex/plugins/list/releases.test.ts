import FlexPluginsListPlugins from '../../../../../commands/flex/plugins/list/releases';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import createTest from '../../../../framework';

describe('Commands/List/FlexPluginsListPlugins', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should get topic name', async () => {
    const cmd = await createTest(FlexPluginsListPlugins)();

    expect(cmd.getTopicName()).toContain(FlexPluginsListPlugins.topicName);
  });
});
