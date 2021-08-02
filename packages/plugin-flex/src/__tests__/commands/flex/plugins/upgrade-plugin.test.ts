import { TwilioApiError, TwilioCliError } from 'flex-dev-utils';
import * as fs from 'flex-dev-utils/dist/fs';

import { Pkg } from '../../../../sub-commands/flex-plugin';
import createTest, { getPrintMethod, implementFileExists, mockGetPkg, mockPrintMethod } from '../../../framework';
import FlexPluginsUpgradePlugin, { DependencyUpdates } from '../../../../commands/flex/plugins/upgrade-plugin';

describe('Commands/FlexPluginsStart', () => {
  const serverlessSid = 'ZS00000000000000000000000000000000';
  const originalCommand = 'original command';
  const cwdPath = 'cwd';
  const appConfigPath = 'appConfig.js';

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
      // eslint-disable-next-line sonarjs/no-duplicate-string
      preCommandWithPreModified: 'pre some command with pre',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      commandWithPreModified: 'some command with pre',
      // command with pre, where main is modified, so it should not be removed
      preCommandModifiedWithPreModified: 'pre command',
      commandModifiedWithPreModified: 'command modified',
      // command with post, where post is modified by main is not; it should not be removed
      // eslint-disable-next-line sonarjs/no-duplicate-string
      commandWithPostModified: 'some command with post',
      // eslint-disable-next-line sonarjs/no-duplicate-string
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
    const writeJSONFile = jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

    await cmd.removePackageScripts([
      { name: 'commandToBeRemoved', it: 'some random command1' },
      { name: 'commandModified', it: originalCommand },
      { name: 'commandModified', it: originalCommand },
      { name: 'commandWithPre', it: 'some command with pre', pre: 'pre some command with pre' },
      { name: 'commandWithPreModified', it: 'some command with pre', pre: originalCommand },
      { name: 'commandModifiedWithPreModified', it: originalCommand, pre: 'pre command' },
      { name: 'commandWithPost', it: 'some command with post', post: 'post some command with post' },
      { name: 'commandWithPostModified', it: 'some command with post', post: originalCommand },
      { name: 'commandModifiedWithPostModified', it: originalCommand, post: 'post command' },
    ]);
    expect(writeJSONFile).toHaveBeenCalledTimes(1);
    expect(writeJSONFile).toHaveBeenCalledWith(
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
    cmd.cwd = cwdPath;
    mockPrintMethod(cmd, 'cannotRemoveCraco');
    implementFileExists(cwdPath, 'craco.config.js');
    const calculateSha256 = jest.spyOn(fs, 'calculateSha256').mockResolvedValue(sha);
    const removeFile = jest.spyOn(fs, 'removeFile').mockReturnThis();
    jest.spyOn(fs, 'copyFile').mockReturnThis();

    await cmd.cleanupScaffold();

    expect(calculateSha256).toHaveBeenCalledTimes(1);
    expect(removeFile).toHaveBeenCalledTimes(1);
    expect(getPrintMethod(cmd, 'cannotRemoveCraco')).not.toHaveBeenCalled();
  });

  it('should not remove craco.config.js if modified', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    // @ts-ignore
    cmd.cwd = cwdPath;
    mockPrintMethod(cmd, 'cannotRemoveCraco');
    implementFileExists(cwdPath, 'craco.config.js');
    const calculateSha256 = jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    const removeFile = jest.spyOn(fs, 'removeFile').mockReturnThis();
    jest.spyOn(fs, 'copyFile').mockReturnThis();

    await cmd.cleanupScaffold();

    expect(calculateSha256).toHaveBeenCalledTimes(1);
    expect(removeFile).not.toHaveBeenCalled();
    expect(getPrintMethod(cmd, 'cannotRemoveCraco')).toHaveBeenCalledTimes(1);
  });

  it('should cleanup appConfig.js', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();

    // @ts-ignore
    cmd.cwd = cwdPath;
    mockPrintMethod(cmd, 'updatePluginUrl');
    implementFileExists(cwdPath, 'public', appConfigPath);
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    const writeFile = jest.spyOn(fs, 'writeFile').mockReturnThis();
    jest.spyOn(fs, 'readFileSync').mockReturnValue('line1\nurl: pluginServiceUrl\nline2');

    await cmd.cleanupScaffold();

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith("line1\nurl: '/plugins'\nline2", cwdPath, 'public', appConfigPath);

    expect(getPrintMethod(cmd, 'updatePluginUrl')).not.toHaveBeenCalled();
  });

  it('should warn about cleaning up appConfig.js', async () => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)();
    const appConfig = 'line1\nurl: something else\nline2';

    // @ts-ignore
    cmd.cwd = cwdPath;
    mockPrintMethod(cmd, 'updatePluginUrl');
    implementFileExists(cwdPath, 'public', appConfigPath);
    jest.spyOn(fs, 'calculateSha256').mockResolvedValue('abc123');
    jest.spyOn(fs, 'copyFile').mockReturnThis();
    const writeFile = jest.spyOn(fs, 'writeFile').mockReturnThis();
    jest.spyOn(fs, 'readFileSync').mockReturnValue(appConfig as string);

    await cmd.cleanupScaffold();

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(appConfig, cwdPath, 'public', appConfigPath);
    expect(getPrintMethod(cmd, 'updatePluginUrl')).toHaveBeenCalledTimes(1);
  });

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

  describe('doRun', () => {
    /**
     * Mock for the .doRun methods
     * @param cmd
     */
    const mockForDoRun = (cmd: FlexPluginsUpgradePlugin) => {
      // @ts-ignore
      jest.spyOn(cmd, 'getLatestVersionOfDep').mockResolvedValue({ version: '4.0.0' });
      // @ts-ignore
      jest.spyOn(cmd.prints, 'upgradeNotification').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV1').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV2').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV3').mockReturnThis();
      jest.spyOn(cmd, 'upgradeToLatest').mockReturnThis();
      jest.spyOn(cmd, 'cleanupNodeModules').mockReturnThis();
    };

    it('should call removeLegacyPlugin', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)('--remove-legacy-plugin');

      jest.spyOn(cmd, 'removeLegacyPlugin').mockReturnThis();

      await cmd.doRun();

      expect(cmd.removeLegacyPlugin).toHaveBeenCalledTimes(1);
    });

    it('should not call cleanupNodeModules if already latest version', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.upgradeToLatest).toHaveBeenCalledTimes(1);
      expect(cmd.cleanupNodeModules).not.toHaveBeenCalled();
    });

    it('should call cleanupNodeModules if not latest version', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      // @ts-ignore
      jest.spyOn(cmd, 'getLatestVersionOfDep').mockResolvedValue({ version: '3.0.0' });
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.cleanupNodeModules).toHaveBeenCalledTimes(1);
    });

    it('should upgrade from v1', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(1);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v2', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(2);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v3', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(3);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v4', async () => {
      const cmd = await createTest(FlexPluginsUpgradePlugin)();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePackageJson', () => {
    const _pkg: Pkg = {
      name: 'test-package',
      version: '1.2.3',
      scripts: {},
      devDependencies: {},
      dependencies: {},
    };

    it('should remove dependencies', async () => {
      const cmd = await removeLegacyPlugin();

      const pkg = {
        ..._pkg,
        dependencies: {
          package1: '1.0.0',
          package2: '2.0.0',
        },
        devDependencies: {
          package3: '3.0.0',
          package4: '4.0.0',
        },
      };
      const depUpdate: DependencyUpdates = {
        remove: ['package1', 'package3'],
        devDeps: {},
        deps: {},
      };
      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(pkg);
      jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

      await cmd.updatePackageJson(depUpdate);

      expect(fs.writeJSONFile).toHaveBeenCalledTimes(1);
      expect(pkg.dependencies).toEqual({ package2: '2.0.0' });
      expect(pkg.devDependencies).toEqual({ package4: '4.0.0' });
      expect(fs.writeJSONFile).toHaveBeenCalledWith(pkg, expect.any(String), 'package.json');
    });

    it('should add provided version', async () => {
      const cmd = await removeLegacyPlugin();

      const pkg = {
        ..._pkg,
        dependencies: {
          package1: '1.0.0',
        },
        devDependencies: {
          package3: '3.0.0',
        },
      };
      const depUpdate: DependencyUpdates = {
        remove: [],
        devDeps: {
          package3: '3.1.0',
          package4: '4.0.0',
        },
        deps: {
          package1: '1.1.0',
          package2: '2.0.0',
        },
      };
      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(pkg);
      jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

      await cmd.updatePackageJson(depUpdate);

      expect(pkg.dependencies).toEqual({ package1: '1.1.0', package2: '2.0.0' });
      expect(pkg.devDependencies).toEqual({ package3: '3.1.0', package4: '4.0.0' });
    });

    it('should add package relative to another', async () => {
      const cmd = await removeLegacyPlugin();

      const pkg = {
        ..._pkg,
        dependencies: {
          package1: '1.0.0',
        },
        devDependencies: {
          package3: '3.0.0',
        },
      };
      const depUpdate: DependencyUpdates = {
        remove: [],
        devDeps: {
          package4: 'package3 || 4.1.1',
        },
        deps: {
          package2: 'package1 || 2.1.1',
        },
      };
      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(pkg);
      jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

      await cmd.updatePackageJson(depUpdate);

      expect(pkg.dependencies).toEqual({ package1: '1.0.0', package2: '1.0.0' });
      expect(pkg.devDependencies).toEqual({ package3: '3.0.0', package4: '3.0.0' });
    });

    it('should add package from the default value if match not found', async () => {
      const cmd = await removeLegacyPlugin();

      const pkg = {
        ..._pkg,
        dependencies: {
          package1: '1.0.0',
        },
        devDependencies: {
          package3: '3.0.0',
        },
      };
      const depUpdate: DependencyUpdates = {
        remove: [],
        devDeps: {
          package4: 'packageUnknown || 4.1.1',
        },
        deps: {
          package2: 'packageUnknown || 2.1.1',
        },
      };
      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(pkg);
      jest.spyOn(fs, 'writeJSONFile').mockReturnThis();

      await cmd.updatePackageJson(depUpdate);

      expect(pkg.dependencies).toEqual({ package1: '1.0.0', package2: '2.1.1' });
      expect(pkg.devDependencies).toEqual({ package3: '3.0.0', package4: '4.1.1' });
    });
  });
});
