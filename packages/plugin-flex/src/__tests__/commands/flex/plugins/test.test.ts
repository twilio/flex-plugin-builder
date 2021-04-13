import createTest from '../../../framework';
import FlexPluginsTest from '../../../../commands/flex/plugins/test';

describe('Commands/FlexPluginsTest', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsTest.hasOwnProperty('flags')).toEqual(true);
  });

  it('should run test script', async () => {
    const cmd = await createTest(FlexPluginsTest)();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();

    await cmd.doRun();

    expect(cmd.runScript).toHaveBeenCalledTimes(2);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check');
    expect(cmd.runScript).toHaveBeenCalledWith('test', ['--env=jsdom']);
  });

  it('should have compatibility set', async () => {
    const cmd = await createTest(FlexPluginsTest)();

    expect(cmd.checkCompatibility).toEqual(true);
  });
});
