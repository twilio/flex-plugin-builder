import { TwilioCliError, env as utilsEnv } from 'flex-dev-utils';
import * as fs from 'flex-dev-utils/dist/fs';

import createTest, { mockGetPkg } from '../framework';
import FlexPlugin from '../../sub-commands/flex-plugin';
import DoneCallback = jest.DoneCallback;

describe('SubCommands/FlexPlugin', () => {
  const { env } = process;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    process.env = { ...env };
  });

  it('should have flag as own property', () => {
    expect(FlexPlugin.hasOwnProperty('flags')).toEqual(true);
  });

  it('should test isPluginFolder to be false if no package.json is found', async () => {
    const cmd = await createTest(FlexPlugin)();

    const checkAFileExists = jest.spyOn(fs, 'checkAFileExists').mockReturnValue(false);

    const result = cmd.isPluginFolder();

    expect(result).toEqual(false);
    expect(checkAFileExists).toHaveBeenCalledTimes(1);
  });

  it('should test isPluginFolder to be false if package was not found in package.json', async () => {
    const cmd = await createTest(FlexPlugin)();

    const checkAFileExists = jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
    mockGetPkg(cmd, {
      dependencies: {},
      devDependencies: {
        'not-a-valid-package': '',
      },
    });

    const result = cmd.isPluginFolder();

    expect(result).toEqual(false);
    expect(checkAFileExists).toHaveBeenCalledTimes(1);
  });

  it('should test isPluginFolder to be true if script is found in dependencies', async () => {
    const cmd = await createTest(FlexPlugin)();

    const checkAFileExists = jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
    mockGetPkg(cmd, {
      dependencies: {
        '@twilio/flex-ui': '',
      },
      devDependencies: {},
    });

    const result = cmd.isPluginFolder();

    expect(result).toEqual(true);
    expect(checkAFileExists).toHaveBeenCalledTimes(1);
  });

  it('should test isPluginFolder to be true if both scripts found in devDependencies', async () => {
    const cmd = await createTest(FlexPlugin)();

    const checkAFileExists = jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
    mockGetPkg(cmd, {
      dependencies: {},
      devDependencies: {
        'flex-plugin-scripts': '',
        '@twilio/flex-ui': '',
      },
    });

    const result = cmd.isPluginFolder();

    expect(result).toEqual(true);
    expect(checkAFileExists).toHaveBeenCalledTimes(1);
  });

  it('should tet doRun throws exception', async (done) => {
    const cmd = await createTest(FlexPlugin)();

    try {
      await cmd.doRun();
    } catch (e) {
      expect(e.message).toContain(' must be implemented');
      done();
    }
  });

  it('should call setEnvironment', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'doRun').mockResolvedValue('any');

    await cmd.run();

    expect(process.env.SKIP_CREDENTIALS_SAVING).toEqual('true');
    expect(process.env.TWILIO_ACCOUNT_SID).toBeDefined();
    expect(process.env.TWILIO_AUTH_TOKEN).toBeDefined();
    expect(process.env.DEBUG).toBeUndefined();
  });

  it('should set debug env to true', async () => {
    const cmd = await createTest(FlexPlugin)('-l', 'debug');

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'doRun').mockResolvedValue('any');

    await cmd.run();

    expect(process.env.DEBUG).toEqual('true');
  });

  it('should run the main command successfully', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'setupEnvironment').mockReturnThis();
    jest.spyOn(cmd, 'doRun').mockResolvedValue(null);

    await cmd.run();

    expect(cmd.checkForUpdate).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit).toBeDefined();
    expect(cmd.pluginsClient).toBeDefined();
    expect(cmd.pluginVersionsClient).toBeDefined();
    expect(cmd.configurationsClient).toBeDefined();

    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
    expect(cmd.setupEnvironment).toHaveBeenCalledTimes(1);
    expect(cmd.doRun).toHaveBeenCalledTimes(1);
  });

  it('should return raw format', async () => {
    const cmd = await createTest(FlexPlugin)('--json');

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'setupEnvironment').mockReturnThis();
    jest.spyOn(cmd, 'doRun').mockResolvedValue({ object: 'result' });

    await cmd.run();

    // @ts-ignore
    expect(cmd._logger.info).toHaveBeenCalledWith('{"object":"result"}');
  });

  it('should not return raw format', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'setupEnvironment').mockReturnThis();
    jest.spyOn(cmd, 'doRun').mockResolvedValue({ object: 'result' });

    await cmd.run();

    // @ts-ignore
    expect(cmd._logger.info).not.toHaveBeenCalledWith('{"object":"result"}');
  });

  it('should throw exception if script needs to run in plugin directory but is not', async (done) => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'doRun').mockResolvedValue(null);

    try {
      await cmd.run();
    } catch (e) {
      expect(e instanceof TwilioCliError).toEqual(true);
      expect(e.message).toContain('flex plugin directory');
      done();
    }
  });

  it('should return null for builderVersion if script is not found', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(fs, 'readJsonFile').mockReturnValue({
      devDependencies: {},
      dependencies: {},
    });

    expect(cmd.builderVersion).toBeNull();
  });

  it('should return version from dependencies', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(fs, 'readJsonFile').mockReturnValue({
      devDependencies: {},
      dependencies: {
        'flex-plugin-scripts': '1.2.3',
      },
    });

    expect(cmd.builderVersion).toEqual(1);
  });

  it('should return version from devDependencies', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(fs, 'readJsonFile').mockReturnValue({
      devDependencies: {
        'flex-plugin-scripts': '^2.3.4-beta.0',
      },
      dependencies: {},
    });

    expect(cmd.builderVersion).toEqual(2);
  });

  it('should return null if invalid version', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(fs, 'readJsonFile').mockReturnValue({
      devDependencies: {
        'flex-plugin-scripts': 'not-a-semver',
      },
      dependencies: {},
    });

    expect(cmd.builderVersion).toBeNull();
  });

  it('should quit if builder version is incorrect', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(3);
    jest.spyOn(cmd, 'checkCompatibility', 'get').mockReturnValue(true);
    jest.spyOn(cmd, 'exit').mockReturnThis();
    jest.spyOn(cmd, 'doRun').mockReturnThis();

    await cmd.run();
    // @ts-ignore
    expect(cmd.exit).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledWith(1);
  });

  it('should not quit if builder version is correct', async () => {
    const cmd = await createTest(FlexPlugin)();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'checkCompatibility', 'get').mockReturnValue(true);
    jest.spyOn(cmd, 'exit').mockReturnThis();
    jest.spyOn(cmd, 'doRun').mockReturnThis();

    await cmd.run();
    // @ts-ignore
    expect(cmd.exit).not.toHaveBeenCalled();
  });

  it('should have compatibility set to false', async () => {
    const cmd = await createTest(FlexPlugin)();

    expect(cmd.checkCompatibility).toEqual(false);
  });

  describe('setupEnvironment', () => {
    const username = 'test-username';
    const password = 'test-password';
    const id = 'testProfile';

    const setupMocks = (cmd: FlexPlugin) => {
      // @ts-ignore
      cmd.currentProfile = { id };
      // @ts-ignore
      jest.spyOn(cmd, 'twilioClient', 'get').mockReturnValue({ username, password });
      jest.spyOn(utilsEnv, 'setTwilioProfile');
      jest.spyOn(utilsEnv, 'setDebug');
      jest.spyOn(utilsEnv, 'persistTerminal');
    };

    it('should setup environment', async () => {
      const cmd = await createTest(FlexPlugin)();
      setupMocks(cmd);

      cmd.setupEnvironment();
      expect(process.env.SKIP_CREDENTIALS_SAVING).toEqual('true');
      expect(process.env.TWILIO_ACCOUNT_SID).toEqual(username);
      expect(process.env.TWILIO_AUTH_TOKEN).toEqual(password);
      expect(utilsEnv.setTwilioProfile).toHaveBeenCalledTimes(1);
      expect(utilsEnv.setTwilioProfile).toHaveBeenCalledWith(id);
      expect(utilsEnv.setDebug).not.toHaveBeenCalled();
      expect(utilsEnv.persistTerminal).not.toHaveBeenCalled();
    });

    it('should setup environment as debug level', async () => {
      const cmd = await createTest(FlexPlugin)('-l', 'debug');
      setupMocks(cmd);

      cmd.setupEnvironment();
      expect(process.env.SKIP_CREDENTIALS_SAVING).toEqual('true');
      expect(process.env.TWILIO_ACCOUNT_SID).toEqual(username);
      expect(process.env.TWILIO_AUTH_TOKEN).toEqual(password);
      expect(utilsEnv.setTwilioProfile).toHaveBeenCalledTimes(1);
      expect(utilsEnv.setTwilioProfile).toHaveBeenCalledWith(id);
      expect(utilsEnv.setDebug).toHaveBeenCalledTimes(1);
      expect(utilsEnv.persistTerminal).toHaveBeenCalledTimes(1);
    });
  });

  describe('pkg', () => {
    it('should set default empty object if devDep or dep not set', async () => {
      const cmd = await createTest(FlexPlugin)();

      jest.spyOn(fs, 'readJsonFile').mockReturnValue({
        devDependencies: null,
        dependencies: null,
      });

      expect(cmd.pkg.dependencies).toEqual({});
      expect(cmd.pkg.devDependencies).toEqual({});
    });

    it('should have devDep and dep', async () => {
      const cmd = await createTest(FlexPlugin)();

      const dep = { package1: '123' };
      const devDep = { package2: '234' };
      jest.spyOn(fs, 'readJsonFile').mockReturnValue({
        devDependencies: devDep,
        dependencies: dep,
      });

      expect(cmd.pkg.dependencies).toEqual(dep);
      expect(cmd.pkg.devDependencies).toEqual(devDep);
    });
  });

  describe('client initialization', () => {
    const callAndVerifyNotInitialized = async (method: string, done: DoneCallback) => {
      const cmd = await createTest(FlexPlugin)();

      try {
        const client = cmd[method];
      } catch (e) {
        expect(e.message).toContain('is not initialized');
        done();
      }
    };

    const callAndVerifyInitialized = async (method: string) => {
      const cmd = await createTest(FlexPlugin)();
      const client = `the-${method}-client`;
      cmd[`_${method}`] = client;

      expect(cmd[method]).toEqual(client);
    };

    it('should throw error if _pluginsApiToolkit is undefined', async (done) => {
      await callAndVerifyNotInitialized('pluginsApiToolkit', done);
    });

    it('should get _pluginsApiToolkit', async () => {
      await callAndVerifyInitialized('pluginsApiToolkit');
    });

    it('should throw error if _pluginsClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('pluginsClient', done);
    });

    it('should throw error if _pluginsClient is undefined', async () => {
      await callAndVerifyInitialized('pluginsClient');
    });

    it('should throw error if _pluginVersionsClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('pluginVersionsClient', done);
    });

    it('should get _pluginVersionsClient', async () => {
      await callAndVerifyInitialized('pluginVersionsClient');
    });

    it('should throw error if _configurationsClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('configurationsClient', done);
    });

    it('should get _configurationsClient', async () => {
      await callAndVerifyInitialized('configurationsClient');
    });

    it('should throw error if _releasesClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('releasesClient', done);
    });

    it('should get _releasesClient', async () => {
      await callAndVerifyInitialized('releasesClient');
    });

    it('should throw error if _flexConfigurationClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('flexConfigurationClient', done);
    });

    it('should get _flexConfigurationClient', async () => {
      await callAndVerifyInitialized('flexConfigurationClient');
    });

    it('should throw error if _serverlessClient is undefined', async (done) => {
      await callAndVerifyNotInitialized('serverlessClient', done);
    });

    it('should get _serverlessClient', async () => {
      await callAndVerifyInitialized('serverlessClient');
    });
  });
});
