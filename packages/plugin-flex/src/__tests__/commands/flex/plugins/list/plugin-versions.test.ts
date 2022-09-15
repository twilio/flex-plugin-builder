import FlexPluginsListPluginVersions from '../../../../../commands/flex/plugins/list/plugin-versions';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

describe('Commands/List/FlexPluginsListPluginVersions', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListPluginVersions.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListPluginVersions.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
