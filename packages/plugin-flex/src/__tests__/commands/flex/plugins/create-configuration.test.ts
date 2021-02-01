import FlexPluginsCreateConfiguration from '../../../../commands/flex/plugins/create-configuration';

describe('Commands/FlexPluginsCreateConfiguration', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsCreateConfiguration.hasOwnProperty('flags')).toEqual(true);
  });
});
