import createTest from '../../../framework';
import FlexPluginsTest from '../../../../commands/flex/plugins/test';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

describe('Commands/FlexPluginsTest', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const createCommand = async (...args: string[]): Promise<FlexPluginsTest> => {
    const cmd = await createTest(FlexPluginsTest)(...args);
    await cmd.init();
    return cmd;
  };

  it('should have own flags', () => {
    expect(FlexPluginsTest.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should run test script without extra args', async () => {
    const cmd = await createCommand();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();

    await cmd.doRun();

    expect(cmd.runScript).toHaveBeenCalledTimes(2);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check');
    expect(cmd.runScript).toHaveBeenCalledWith('test', ['--env=jsdom']);
  });

  it('should run test script with extra args', async () => {
    const cmd = await createCommand('--', '--arg1', '--arg2');
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();

    await cmd.doRun();

    expect(cmd.runScript).toHaveBeenCalledTimes(2);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check');
    expect(cmd.runScript).toHaveBeenCalledWith('test', ['--env=jsdom', '--arg1', '--arg2']);
  });

  it('should have compatibility set', async () => {
    const cmd = await createCommand();

    expect(cmd.checkCompatibility).toEqual(true);
  });
});
