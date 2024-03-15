import FlexPluginsListPlugins from '../../../../../commands/flex/plugins/list/plugins';
import FlexPlugin from '../../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../../sub-commands/information-flex-plugin';
import '../../../../framework';

jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('Commands/List/FlexPluginsListPlugins', () => {
  it('should have own flags', () => {
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(InformationFlexPlugin.flags);
    expect(FlexPluginsListPlugins.flags).not.toBeSameObject(FlexPlugin.flags);
  });
});
