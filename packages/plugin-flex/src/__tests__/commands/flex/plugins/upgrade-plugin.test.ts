import { TwilioApiError, TwilioCliError, packages } from '@twilio/flex-dev-utils';
import * as fs from '@twilio/flex-dev-utils/dist/fs';
import * as spawn from '@twilio/flex-dev-utils/dist/spawn';

import FlexPlugin, { Pkg } from '../../../../sub-commands/flex-plugin';
import createTest, { getPrintMethod, implementFileExists, mockGetPkg, mockPrintMethod } from '../../../framework';
import FlexPluginsUpgradePlugin, { DependencyUpdates } from '../../../../commands/flex/plugins/upgrade-plugin';

jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('@twilio/flex-dev-utils/dist/spawn');

describe('Commands/FlexPluginsStart', () => {
  const serverlessSid = 'ZS00000000000000000000000000000000';
  const originalCommand = 'original command';
  const cwdPath = 'cwd';
  const appConfigPath = 'appConfig.js';
  const paths = {
    app: { isTSProject: () => false },
  };

  const createCommand = async (...args: string[]): Promise<FlexPluginsUpgradePlugin> => {
    const cmd = await createTest(FlexPluginsUpgradePlugin)(...args);
    await cmd.init();
    return cmd;
  };

  const removeLegacyPlugin = async () => {
    const cmd = await createCommand();

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
    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
    jest.spyOn(spawn, 'spawn').mockReturnThis();
  });

  it('should have own flags', () => {
    expect(FlexPluginsUpgradePlugin.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createCommand();
    expect(cmd._flags).toBeDefined();
  });

  it('should should return then version of @twilio/flex-plugin-scripts from dependencies', async () => {
    const cmd = await createCommand();

    mockGetPkg(cmd, {
      dependencies: { '@twilio/flex-plugin-scripts': '3.0.0' },
      devDependencies: {},
    });
    expect(cmd.pkgVersion).toEqual(3);
  });

  it('should should return the version of @twilio/flex-plugin-scripts from devDependencies', async () => {
    const cmd = await createCommand();

    mockGetPkg(cmd, {
      dependencies: {},
      devDependencies: { '@twilio/flex-plugin-scripts': '4.0.0' },
    });

    expect(cmd.pkgVersion).toEqual(4);
  });

  it('should should throw exception if no version is found', async () => {
    const cmd = await createCommand();

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
    const cmd = await createCommand();

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
    const cmd = await createCommand();

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
    const cmd = await createCommand();

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
    const cmd = await createCommand();

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
    const cmd = await createCommand();
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
    jest.spyOn(cmd, 'pkg', 'get').mockReturnThis();

    await cmd.removeLegacyPlugin();

    expect(getPrintMethod(cmd, 'warningPluginNotInAPI')).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledWith(1);
  });

  it('should exit if no serviceSid is found', async () => {
    const cmd = await removeLegacyPlugin();

    jest.spyOn(cmd, 'pkg', 'get').mockReturnThis();
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

    mockGetPkg(cmd, {
      name: 'plugin-test',
      dependencies: {},
      devDependencies: {},
    });
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

    mockGetPkg(cmd, {
      name: 'plugin-test',
      dependencies: {},
      devDependencies: {},
    });
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
      jest.spyOn(packages, 'getRegistryVersion').mockResolvedValue({ version: '4.0.0' });
      // @ts-ignore
      jest.spyOn(cmd.prints, 'upgradeNotification').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV1').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV2').mockReturnThis();
      jest.spyOn(cmd, 'upgradeFromV3').mockReturnThis();
      jest.spyOn(cmd, 'upgradeToLatest').mockReturnThis();
      jest.spyOn(cmd, 'cleanupNodeModules').mockReturnThis();
      jest.spyOn(cmd, 'flexUIVersion', 'get').mockReturnValue(1);
    };

    it('should call removeLegacyPlugin', async () => {
      const cmd = await createCommand('--remove-legacy-plugin');

      jest.spyOn(cmd, 'pkg', 'get').mockReturnThis();
      jest.spyOn(cmd, 'removeLegacyPlugin').mockReturnThis();
      jest.spyOn(cmd, 'flexUIVersion', 'get').mockReturnValue(1);

      await cmd.doRun();

      expect(cmd.removeLegacyPlugin).toHaveBeenCalledTimes(1);
    });

    it('should call upgrade notification', async () => {
      const cmd = await createCommand('--yes');
      mockForDoRun(cmd);
      // @ts-ignore
      const upgradeNotification = jest.spyOn(cmd.prints, 'upgradeNotification');
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(upgradeNotification).toHaveBeenCalledTimes(1);
      expect(upgradeNotification).toHaveBeenCalledWith(true);
    });

    it('should call upgrade notification without yes flag', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      // @ts-ignore
      const upgradeNotification = jest.spyOn(cmd.prints, 'upgradeNotification');
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(upgradeNotification).toHaveBeenCalledTimes(1);
      expect(upgradeNotification).toHaveBeenCalledWith(undefined);
    });

    it('should not call cleanupNodeModules if already latest version', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.upgradeToLatest).toHaveBeenCalledTimes(1);
      expect(cmd.cleanupNodeModules).not.toHaveBeenCalled();
    });

    it('should call cleanupNodeModules if not latest version', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      // @ts-ignore
      jest.spyOn(packages, 'getRegistryVersion').mockResolvedValue({ version: '3.0.0' });
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.cleanupNodeModules).toHaveBeenCalledTimes(1);
    });

    it('should upgrade from v1', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(1);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v2', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(2);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v3', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(3);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeToLatest).not.toHaveBeenCalled();
    });

    it('should upgrade from v4', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(cmd.upgradeFromV1).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV2).not.toHaveBeenCalled();
      expect(cmd.upgradeFromV3).not.toHaveBeenCalled();
      expect(cmd.upgradeToLatest).toHaveBeenCalledTimes(1);
    });

    it('should upgrade to flex ui 2.0', async () => {
      const cmd = await createCommand('--flex-ui-2.0');
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'upgradeToFlexUI2').mockReturnThis();
      jest.spyOn(packages, 'getLatestFlexUIVersion').mockResolvedValue('2.0.0-alpha');
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      await cmd.doRun();

      expect(packages.getLatestFlexUIVersion).toHaveBeenCalledTimes(1);
      expect(packages.getLatestFlexUIVersion).toHaveBeenCalledWith(2);
      expect(cmd.upgradeToFlexUI2).toHaveBeenCalledTimes(1);
      expect(cmd.upgradeToLatest).toHaveBeenCalledTimes(1);
    });

    it('should throw error if flex ui is already 2.0 and --flex-ui-2.0 is not passed', async (done) => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'flexUIVersion', 'get').mockReturnValue(2);

      try {
        await cmd.doRun();
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
        expect(e.message).toContain('Incomplete arguments passed.');
        done();
      }
    });

    it('should quit if it requires manual changes', async () => {
      const cmd = await createCommand();
      mockForDoRun(cmd);
      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);

      // @ts-ignore
      jest.spyOn(fs, 'findInFiles').mockResolvedValue({ 'file/path': {} });

      // @ts-ignore
      const manualUpgrade = jest.spyOn(cmd.prints, 'manualUpgrade').mockReturnThis();
      // @ts-ignore
      const scriptSucceeded = jest.spyOn(cmd.prints, 'scriptSucceeded').mockReturnThis();

      await cmd.doRun();

      expect(manualUpgrade).toHaveBeenCalledTimes(1);
      expect(manualUpgrade).toHaveBeenCalledWith(['file/path']);
      expect(scriptSucceeded).not.toHaveBeenCalled();
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

  describe('getDependencyUpdatesFlexUI2', () => {
    const _pkg: Pkg = {
      name: 'test-package',
      version: '1.2.3',
      scripts: {},
      devDependencies: {
        '@twilio/flex-ui': '^1',
        'react-test-renderer': '16.0.0',
      },
      dependencies: {
        react: '^16.5.2',
        'react-dom': '^16.5.2',
        'react-redux': '~5.1.0',
        redux: '3.7.2',
        'react-router': '4.3.1',
        'react-router-dom': '4.3.1',
        'react-router-redux': '5.0.0-alpha.9',
        emotion: '9.2.6',
        'react-emotion': '9.2.6',
        'emotion-theming': '9.2.6',
        'create-emotion-styled': '^9.2.6',
        '@material-ui/core': '3.9.4',
      },
    };
    const returnPkg: DependencyUpdates = {
      remove: [
        'react-router',
        'react-router-redux',
        'emotion',
        'emotion-theming',
        'react-emotion',
        'create-emotion-styled',
      ],
      deps: {
        react: '17.0.2',
        'react-dom': '17.0.2',
        'react-redux': '^7.2.2',
        redux: '^4.0.5',
        'react-router-dom': '^5.2.0',
        '@emotion/css': '^11.1.3',
        '@emotion/react': '^11.1.5',
        '@emotion/styled': '^11.1.5',
        '@material-ui/core': '^4.11.3',
      },
      devDeps: {
        '@twilio/flex-ui': '2.0.0-alpha',
        'react-test-renderer': '17.0.2',
      },
    };

    it('should return the correct DependencyUpdates', async () => {
      const cmd = await createCommand('--flex-ui-2.0');

      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);
      jest.spyOn(cmd, 'upgradeToLatest').mockReturnThis();
      jest.spyOn(cmd, 'upgradeToFlexUI2').mockReturnThis();
      jest.spyOn(packages, 'getLatestFlexUIVersion').mockResolvedValue('2.0.0-alpha');
      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(_pkg);
      jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
      jest.spyOn(cmd, 'updatePackageJson').mockReturnThis();
      const spy = jest.spyOn(cmd, 'getDependencyUpdatesFlexUI2');

      cmd.getDependencyUpdatesFlexUI2('2.0.0-alpha');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('2.0.0-alpha');
      expect(spy).toHaveReturnedWith(returnPkg);
    });
  });

  describe('upgradeToFlexUI2', () => {
    const returnPkg: DependencyUpdates = {
      remove: ['react-router'],
      deps: {
        react: '17.0.2',
        'react-dom': '17.0.2',
        'react-router-dom': '^5.2.0',
        '@material-ui/core': '^4.11.3',
      },
      devDeps: {
        '@twilio/flex-ui': '2.0.0-alpha',
        'react-test-renderer': '17.0.2',
      },
    };

    it('should call all methods', async () => {
      const cmd = await createCommand('--flex-ui-2.0');

      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);
      jest.spyOn(cmd, 'upgradeToLatest').mockReturnThis();
      jest.spyOn(packages, 'getLatestFlexUIVersion').mockResolvedValue('2.0.0-alpha');
      // @ts-ignore
      const print = jest.spyOn(cmd.prints, 'upgradeToFlexUI2');
      const dep = jest.spyOn(cmd, 'getDependencyUpdatesFlexUI2').mockReturnValue(returnPkg);
      const packageJson = jest.spyOn(cmd, 'updatePackageJson').mockReturnThis();

      await cmd.upgradeToFlexUI2('2.0.0-alpha');

      expect(print).toHaveBeenCalledTimes(1);
      expect(dep).toHaveBeenCalledTimes(1);
      expect(packageJson).toHaveBeenCalledTimes(1);
      expect(packageJson).toHaveBeenCalledWith(returnPkg);
    });
  });

  describe('getDependencyUpdates', () => {
    const olderPkg: Pkg = {
      name: 'test-package',
      version: '1.2.3',
      scripts: {},
      devDependencies: {
        '@twilio/flex-ui': '^1',
        'react-test-renderer': '16.0.0',
      },
      dependencies: {
        react: '15.0.2',
        'react-dom': '15.0.2',
        '@twilio/flex-plugin-scripts': '4.1.3',
      },
    };
    const olderReturn: DependencyUpdates = {
      remove: FlexPluginsUpgradePlugin.packagesToRemove,
      deps: {
        '@twilio/flex-plugin-scripts': '*',
        react: 'react || 16.5.2',
        'react-dom': 'react || 16.5.2',
      },
      devDeps: {
        '@twilio/flex-ui': '^1',
        'react-test-renderer': 'react || 16.5.2',
      },
    };

    const getDependencyUpdates = async () => {
      const cmd = await createCommand();

      jest.spyOn(cmd, 'pkgVersion', 'get').mockReturnValue(4);
      jest.spyOn(cmd, 'upgradeToLatest').mockReturnThis();
      jest.spyOn(packages, 'getLatestFlexUIVersion').mockResolvedValue('2.0.0-alpha');
      jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
      jest.spyOn(cmd, 'updatePackageJson').mockReturnThis();
      // @ts-ignore
      jest.spyOn(cmd.prints, 'upgradeNotification').mockReturnThis();
      // @ts-ignore
      jest.spyOn(packages, 'getRegistryVersion').mockResolvedValue({ version: '4.2.2' });
      jest.spyOn(cmd, 'cleanupNodeModules').mockReturnThis();
      jest.spyOn(cmd, 'flexUIVersion', 'get').mockReturnValue(1);

      await cmd.run();

      return cmd;
    };

    it('should return dependency updates correctly', async () => {
      const cmd = await getDependencyUpdates();

      jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(olderPkg);
      const spy = jest.spyOn(cmd, 'getDependencyUpdates');

      cmd.getDependencyUpdates();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith(olderReturn);
    });
  });
});
