import FlexPluginsListConfigurations from '../../../../../commands/flex/plugins/list/configurations';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import createTest from '../../../../framework';

describe('Commands/List/FlexPluginsListConfigurations', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListConfigurations.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListConfigurations.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should get topic name', async () => {
    const cmd = await createTest(FlexPluginsListConfigurations)();

    expect(cmd.getTopicName()).toContain(FlexPluginsListConfigurations.topicName);
  });
});
