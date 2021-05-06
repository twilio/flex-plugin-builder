import FlexPluginsRelease from '../../../../commands/flex/plugins/release';

describe('Commands/FlexPluginsRelease', () => {
  it('should have flag as own property', () => {
    expect(FlexPluginsRelease.hasOwnProperty('flags')).toEqual(true);
  });
});
