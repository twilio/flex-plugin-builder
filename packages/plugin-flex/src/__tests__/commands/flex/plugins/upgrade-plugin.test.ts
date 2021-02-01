import { TwilioApiError } from 'flex-plugins-utils-exception';

import createTest, { getPrintMethod, implementFileExists, mockGetPkg, mockPrintMethod } from '../../../framework';
import { TwilioCliError } from '../../../../exceptions';
import FlexPluginsUpgradePlugin from '../../../../commands/flex/plugins/upgrade-plugin';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  const serverlessSid = 'ZS00000000000000000000000000000000';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsUpgradePlugin.hasOwnProperty('flags')).toEqual(true);
  });

  it('should should return then version of flex-plugin-scripts from dependencies', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    mockGetPkg(cmd, {
      dependencies: { 'flex-plugin-scripts': '3.0.0' },
    });
    expect(cmd.pkgVersion).toEqual(3);
  });

  it('should should return the version of flex-plugin-scripts from devDependencies', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    mockGetPkg(cmd, {
      dependencies: {},
      devDependencies: { 'flex-plugin-scripts': '4.0.0' },
    });

    expect(cmd.pkgVersion).toEqual(4);
  });

  it('should should throw exception if no version is found', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    mockGetPkg(cmd, {
      dependencies: {},
      devDependencies: {},
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x = cmd.pkgVersion;
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('not found');
    }
  });

  it('should remove packages that have no post/post', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    const untouchedScripts = {
      untouchedCommand: 'some command',
      // modified
      commandModified: 'some random command2',
      // command with pre, where pre is modified by main is not; it should not be removed
      preCommandWithPreModified: 'pre some command with pre',
      commandWithPreModified: 'some command with pre',
      // command with pre, where main is modified, so it should not be removed
      preCommandModifiedWithPreModified: 'pre command',
      commandModifiedWithPreModified: 'command modified',
      // command with post, where post is modified by main is not; it should not be removed
      commandWithPostModified: 'some command with post',
      postCommandWithPostModified: 'post some command with post',
      // command with post, where main is modified, so it should not be removed
      commandModifiedWithPostModified: 'command modified',
      postCommandModifiedWithPostModified: 'post command',
    };

    mockGetPkg(cmd, {
      scripts: {
        ...untouchedScripts,
        untouchedCommand: 'some command',
        // unmodified, should be removed
        commandToBeRemoved: 'some random command1',
        // command that has a pre, unmodified so should be removed
        preCommandWithPre: 'pre some command with pre',
        commandWithPre: 'some command with pre',
        // command that has a post, unmodified so should be removed
        commandWithPost: 'some command with post',
        postCommandWithPost: 'post some command with post',
      },
    });
    jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

    await cmd.removePackageScripts([
      { name: 'commandToBeRemoved', it: 'some random command1' },
      { name: 'commandModified', it: 'original command' },
      { name: 'commandModified', it: 'original command' },
      { name: 'commandWithPre', it: 'some command with pre', pre: 'pre some command with pre' },
      { name: 'commandWithPreModified', it: 'some command with pre', pre: 'original command' },
      { name: 'commandModifiedWithPreModified', it: 'original command', pre: 'pre command' },
      { name: 'commandWithPost', it: 'some command with post', post: 'post some command with post' },
      { name: 'commandWithPostModified', it: 'some command with post', post: 'original command' },
      { name: 'commandModifiedWithPostModified', it: 'original command', post: 'post command' },
    ]);
    expect(fs.writeJSONFile).toHaveBeenCalledTimes(1);
    expect(fs.writeJSONFile).toHaveBeenCalledWith(
      { scripts: expect.objectContaining(untouchedScripts) },
      expect.any(String),
      expect.any(String),
    );
  });

  it('should remove craco.config.js', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    // @ts-ignore
    const sha = FlexPluginsUpgradePlugin.cracoConfigSha;
    // @ts-ignore
    cmd.cwd = 'cwd';
    mockPrintMethod(cmd, 'cannotRemoveCraco');
    implementFileExists('cwd', 'craco.config.js');
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue(sha);
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    jest.spyOn(fs, 'removeFile').mockReturnThis();

    await cmd.cleanupScaffold();

    expect(fs.calculateSha256).toHaveBeenCalledTimes(1);
    expect(fs.removeFile).toHaveBeenCalledTimes(1);
    expect(getPrintMethod(cmd, 'cannotRemoveCraco')).not.toHaveBeenCalled();
  });

  it('should not remove craco.config.js if modified', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    // @ts-ignore
    cmd.cwd = 'cwd';
    mockPrintMethod(cmd, 'cannotRemoveCraco');
    implementFileExists('cwd', 'craco.config.js');
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    jest.spyOn(fs, 'removeFile').mockReturnThis();

    await cmd.cleanupScaffold();

    expect(fs.calculateSha256).toHaveBeenCalledTimes(1);
    expect(fs.removeFile).not.toHaveBeenCalled();
    expect(getPrintMethod(cmd, 'cannotRemoveCraco')).toHaveBeenCalledTimes(1);
  });

  it('should cleanup appConfig.js', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    // @ts-ignore
    cmd.cwd = 'cwd';
    mockPrintMethod(cmd, 'updatePluginUrl');
    implementFileExists('cwd', 'public', 'appConfig.js');
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    jest.spyOn(fs, 'writeFile').mockReturnThis();
    jest.spyOn(fs, 'readFile').mockReturnValue('line1\nurl: pluginServiceUrl\nline2');

    await cmd.cleanupScaffold();

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith("line1\nurl: '/plugins'\nline2", 'cwd', 'public', 'appConfig.js');

    expect(getPrintMethod(cmd, 'updatePluginUrl')).not.toHaveBeenCalled();
  });

  it('should warn about cleaning up appConfig.js', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();
    const appConfig = 'line1\nurl: something else\nline2';

    // @ts-ignore
    cmd.cwd = 'cwd';
    mockPrintMethod(cmd, 'updatePluginUrl');
    implementFileExists('cwd', 'public', 'appConfig.js');
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    jest.spyOn(fs, 'writeFile').mockReturnThis();
    jest.spyOn(fs, 'readFile').mockReturnValue(appConfig as string);

    await cmd.cleanupScaffold();

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(appConfig, 'cwd', 'public', 'appConfig.js');
    expect(getPrintMethod(cmd, 'updatePluginUrl')).toHaveBeenCalledTimes(1);
  });

  it('should call removeLegacyPlugin', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)('--remove-legacy-plugin');

    jest.spyOn(cmd, 'removeLegacyPlugin').mockReturnThis();

    await cmd.doRun();

    expect(cmd.removeLegacyPlugin).toHaveBeenCalledTimes(1);
  });

  const removeLegacyPlugin = async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    jest.spyOn(cmd, 'exit').mockReturnThis();
    mockPrintMethod(cmd, 'removeLegacyNotification');
    mockPrintMethod(cmd, 'warningPluginNotInAPI');
    mockPrintMethod(cmd, 'noLegacyPluginFound');

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'doRun').mockReturnThis();

    await cmd.run();

    return cmd;
  };

  it('should print warning about plugins-api registration required before remove-legacy', async () => {
    const cmd = await removeLegacyPlugin();

    jest.spyOn(cmd.pluginsClient, 'get').mockRejectedValue(new TwilioApiError(0, '', 404));

    await cmd.removeLegacyPlugin();

    expect(getPrintMethod(cmd, 'warningPluginNotInAPI')).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledWith(1);
  });

  it('should exit if no serviceSid is found', async () => {
    const cmd = await removeLegacyPlugin();

    jest.spyOn(cmd.pluginsClient, 'get').mockReturnThis();
    jest.spyOn(cmd.flexConfigurationClient, 'getServerlessSid').mockResolvedValue(null);
    jest.spyOn(cmd.serverlessClient, 'hasLegacy');

    await cmd.removeLegacyPlugin();

    expect(getPrintMethod(cmd, 'warningPluginNotInAPI')).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).not.toHaveBeenCalled();
  });

  it('should notify no legacy plugin is found', async () => {
    const cmd = await removeLegacyPlugin();

    jest.spyOn(cmd.pluginsClient, 'get').mockReturnThis();
    jest.spyOn(cmd.flexConfigurationClient, 'getServerlessSid').mockResolvedValue(serverlessSid);
    jest.spyOn(cmd.serverlessClient, 'hasLegacy').mockResolvedValue(false);

    await cmd.removeLegacyPlugin();

    expect(getPrintMethod(cmd, 'warningPluginNotInAPI')).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledWith(serverlessSid, expect.any(String));
    expect(getPrintMethod(cmd, 'noLegacyPluginFound')).toHaveBeenCalledTimes(1);
  });

  it('should remove legacy', async () => {
    const cmd = await removeLegacyPlugin();

    jest.spyOn(cmd.pluginsClient, 'get').mockReturnThis();
    jest.spyOn(cmd.flexConfigurationClient, 'getServerlessSid').mockResolvedValue(serverlessSid);
    jest.spyOn(cmd.serverlessClient, 'hasLegacy').mockResolvedValue(true);
    jest.spyOn(cmd.serverlessClient, 'removeLegacy').mockResolvedValue();

    await cmd.removeLegacyPlugin();

    expect(getPrintMethod(cmd, 'warningPluginNotInAPI')).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledWith(serverlessSid, expect.any(String));
    expect(cmd.serverlessClient.removeLegacy).toHaveBeenCalledTimes(1);
  });
});
