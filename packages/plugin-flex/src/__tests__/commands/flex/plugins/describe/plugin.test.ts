import FlexPluginsDescribePlugin from '../../../../../commands/flex/plugins/describe/plugin';

describe('Commands/Describe/FlexPluginsDescribePlugin', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsDescribePlugin.hasOwnProperty('flags')).toEqual(true);
  });
});
