import FlexPluginsRelease from '../../../../commands/flex/plugins/release';
import CreateConfiguration from '../../../../sub-commands/create-configuration';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import '../../../framework';

describe('Commands/FlexPluginsRelease', () => {
  it('should have own flags', () => {
    expect(FlexPluginsRelease.flags).not.toBeSameObject(CreateConfiguration.flags);
    expect(FlexPluginsRelease.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
