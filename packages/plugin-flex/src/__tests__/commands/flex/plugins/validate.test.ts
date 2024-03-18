import createTest from '../../../framework';
import FlexPluginsValidate from '../../../../commands/flex/plugins/validate';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

describe('Validate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const createCommand = async (...args: string[]): Promise<FlexPluginsValidate> => {
    const cmd = await createTest(FlexPluginsValidate)(...args);
    await cmd.init();
    return cmd;
  };

  it('should have own flags', () => {
    expect(FlexPluginsValidate.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should run validate script', async () => {
    const cmd = await createCommand();

    jest.spyOn(cmd, 'runScript').mockReturnThis();

    await cmd.doRun();

    expect(cmd.runScript).toHaveBeenCalledTimes(1);
    expect(cmd.runScript).toHaveBeenCalledWith('validate');
  });

  it('should have compatibility set', async () => {
    const cmd = await createCommand();
    expect(cmd.checkCompatibility).toEqual(true);
  });
});
