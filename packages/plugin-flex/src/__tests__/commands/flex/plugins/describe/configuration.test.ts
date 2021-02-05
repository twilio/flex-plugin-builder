import FlexPluginsDescribeConfiguration from '../../../../../commands/flex/plugins/describe/configuration';

describe('Commands/Describe/FlexPluginsDescribeConfiguration', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsDescribeConfiguration.hasOwnProperty('flags')).toEqual(true);
  });
});
