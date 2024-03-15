import FlexPluginsCreateConfiguration from '../../../../commands/flex/plugins/create-configuration';
import CreateConfiguration from '../../../../sub-commands/create-configuration';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import '../../../framework';

describe('Commands/FlexPluginsCreateConfiguration', () => {
  it('should have own flags', () => {
    expect(FlexPluginsCreateConfiguration.flags).not.toBeSameObject(CreateConfiguration.flags);
    expect(FlexPluginsCreateConfiguration.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
