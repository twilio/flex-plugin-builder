import FlexPluginsListConfigurations from '../../../../../commands/flex/plugins/list/configurations';

describe('Commands/List/FlexPluginsListConfigurations', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsListConfigurations.hasOwnProperty('flags')).toEqual(true);
  });
});
