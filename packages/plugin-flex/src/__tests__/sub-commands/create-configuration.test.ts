import FlexPlugin from '../../sub-commands/create-configuration';

describe('SubCommands/CreateConfiguration', () => {
  it('should have flag as own property', () => {
    expect(FlexPlugin.hasOwnProperty('flags')).toEqual(true);
  });
});
