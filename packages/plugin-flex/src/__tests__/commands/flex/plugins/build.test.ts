import createTest from '../../../framework';
import FlexPluginsBuild from '../../../../commands/flex/plugins/build';

describe('Build2', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsBuild.hasOwnProperty('flags')).toEqual(true);
  });

  it('should run build script', async () => {
    const cmd = await createTest(FlexPluginsBuild)();

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();

    await cmd.doRun();

    expect(cmd.runScript).toHaveBeenCalledTimes(2);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check');
    expect(cmd.runScript).toHaveBeenCalledWith('build');
  });

  it('should have compatibility set', async () => {
    const cmd = await createTest(FlexPluginsBuild)();

    expect(cmd.checkCompatibility).toEqual(true);
  });
});
