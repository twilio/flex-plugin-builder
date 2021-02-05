import FlexPluginsListPlugins from '../../../../../commands/flex/plugins/list/releases';

describe('Commands/List/FlexPluginsListPlugins', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsListPlugins.hasOwnProperty('flags')).toEqual(true);
  });
});
