import FlexPluginsDescribeRelease from '../../../../../commands/flex/plugins/describe/release';

describe('Commands/Describe/FlexPluginsDescribeRelease', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsDescribeRelease.hasOwnProperty('flags')).toEqual(true);
  });
});
