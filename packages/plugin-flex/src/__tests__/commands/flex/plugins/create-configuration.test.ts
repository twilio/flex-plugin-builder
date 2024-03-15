import FlexPluginsCreateConfiguration from '../../../../commands/flex/plugins/create-configuration';
import CreateConfiguration from '../../../../sub-commands/create-configuration';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import '../../../framework';

jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('Commands/FlexPluginsCreateConfiguration', () => {
  it('should have own flags', () => {
    expect(FlexPluginsCreateConfiguration.flags).not.toBeSameObject(CreateConfiguration.flags);
    expect(FlexPluginsCreateConfiguration.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
