import FlexPluginsListPluginVersions from '../../../../../commands/flex/plugins/list/plugin-versions';

describe('Commands/List/FlexPluginsListPluginVersions', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsListPluginVersions.hasOwnProperty('flags')).toEqual(true);
  });
});
