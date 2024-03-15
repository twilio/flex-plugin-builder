import FlexPluginsListPlugins from '../../../../../commands/flex/plugins/list/releases';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/List/FlexPluginsListPlugins', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
