import FlexPluginsDescribePluginVersion from '../../../../../commands/flex/plugins/describe/plugin-version';

describe('Commands/Describe/FlexPluginsDescribePluginVersion', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsDescribePluginVersion.hasOwnProperty('flags')).toEqual(true);
  });
});
