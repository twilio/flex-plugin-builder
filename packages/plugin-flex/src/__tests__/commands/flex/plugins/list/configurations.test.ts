import FlexPluginsListConfigurations from '../../../../../commands/flex/plugins/list/configurations';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/List/FlexPluginsListConfigurations', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListConfigurations.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListConfigurations.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
