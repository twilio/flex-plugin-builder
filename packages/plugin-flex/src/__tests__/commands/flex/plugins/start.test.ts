/* eslint-disable camelcase */

import * as pluginBuilderStartScript from '@twilio/flex-plugin-scripts/dist/scripts/start';
import { TwilioCliError, env, TwilioError, TwilioApiError } from '@twilio/flex-dev-utils';
import * as fs from '@twilio/flex-dev-utils/dist/fs';
import { PluginsConfig } from '@twilio/flex-plugin-scripts';
import { PluginVersionResource } from '@twilio/flex-plugins-api-client';
import * as updateNotifier from '@twilio/flex-dev-utils/dist/updateNotifier';
import * as spawn from '@twilio/flex-dev-utils/dist/spawn';

import createTest, { mockGetPkg } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

const includeRemote = 'include-remote';
const flexUiSource = 'flex-ui-source';

jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('@twilio/flex-dev-utils/dist/updateNotifier');
jest.mock('@twilio/flex-dev-utils/dist/spawn');

describe('Commands/FlexPluginsStart', () => {
  const name = 'plugin-test';
  const goodVersion = '2.0.0';
  const badVersion = 'a.b.c';
  const preLocalRunCheck = 'pre-localrun-check';
  const preStartCheck = 'pre-start-check';
  const preScriptCheck = 'pre-script-check';
  const pluginNameSample = 'plugin-sample';
  const pluginNameOne = 'plugin-testOne';
  const pluginNameTwo = 'plugin-testTwo';
  const pluginNameBad = 'pluginBad';
  const pluginsConfig: PluginsConfig = {};
  pluginsConfig['plugin-testOne'] = { port: 100 };
  const pkg = {
    name: pluginNameOne,
    dependencies: {
      '@twilio/flex-plugin-scripts': '4.0.0',
    },
  };
  const badVersionPkg = {
    name: pluginNameBad,
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      '@twilio/flex-plugin-scripts': '3.9.9',
    },
    devDependencies: {},
  };
  const badPluginsPkg = {
    name: 'fakePlugin',
    devDependencies: {},
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      '@twilio/flex-plugin-scripts': '4.0.0',
    },
  };
  const config = {
    plugins: [
      { name: pluginNameOne, dir: 'test-dir' },
      { name: pluginNameTwo, dir: 'test-dir' },
      { name: pluginNameBad, dir: 'test-dir' },
    ],
  };
  const paths = {
    app: { isTSProject: () => false },
  };

  let findPortAvailablePort = jest.spyOn(pluginBuilderStartScript, 'findPortAvailablePort');
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
    jest.spyOn(spawn, 'spawn').mockReturnThis();
    process.env = { ...OLD_ENV };

    findPortAvailablePort = jest.spyOn(pluginBuilderStartScript, 'findPortAvailablePort');
  });

  const createCommand = async (...args: string[]): Promise<FlexPluginsStart> => {
    const cmd = await createTest(FlexPluginsStart)(...args);
    await cmd.init();
    return cmd;
  };

  it('should have own flags', () => {
    expect(FlexPluginsStart.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should set parsed flags', async () => {
    const cmd = await createCommand();
    expect(cmd._flags).toBeDefined();
  });

  it('should run start script for the directory plugin', async () => {
    const cmd = await createCommand();

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValueOnce(3000);
    findPortAvailablePort.mockResolvedValueOnce(100);

    await cmd.doRun();

    expect(cmd.pluginsConfig).toEqual(config);
    expect(cmd.runScript).toHaveBeenCalledTimes(4);
    expect(cmd.runScript).toHaveBeenCalledWith(preLocalRunCheck, [pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith('start', [
      'flex',
      '--name',
      pkg.name,
      '--port',
      '3000',
      '--plugin-config',
      JSON.stringify(pluginsConfig),
    ]);
    expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', pkg.name]);
    expect(cmd.spawnScript).toHaveBeenCalledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
  });

  it('should error due to bad versioning', async () => {
    jest.spyOn(updateNotifier, 'checkForUpdate').mockReturnThis();

    const cmd = await createCommand();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, badVersionPkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(badVersionPkg);
    findPortAvailablePort.mockResolvedValue(100);

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('is not compatible');
      expect(cmd._flags.name).toBeUndefined();
      expect(cmd._flags[includeRemote]).toBeUndefined();
      expect(cmd._flags[flexUiSource]).toBeUndefined();
      expect(cmd.runScript).toHaveBeenCalledTimes(3);
      expect(cmd.runScript).toHaveBeenCalledWith(preLocalRunCheck, [badVersionPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', badVersionPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', badVersionPkg.name]);
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should error due to not being in the plugins.json file', async () => {
    jest.spyOn(updateNotifier, 'checkForUpdate').mockReturnThis();

    const cmd = await createCommand();

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, badPluginsPkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    findPortAvailablePort.mockResolvedValue(100);

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('was not found');
      expect(cmd._flags.name).toBeUndefined();
      expect(cmd._flags[includeRemote]).toBeUndefined();
      expect(cmd._flags[flexUiSource]).toBeUndefined();
      expect(cmd.runScript).toHaveBeenCalledTimes(3);
      expect(cmd.runScript).toHaveBeenCalledWith(preLocalRunCheck, [badPluginsPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', badPluginsPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', badPluginsPkg.name]);
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should read the name and include-remote flags', async () => {
    const cmd = await createCommand('--name', pluginNameOne, '--name', pluginNameTwo, '--include-remote');

    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.run();

    expect(cmd._flags.name.includes(pluginNameOne));
    expect(cmd._flags.name.includes(pluginNameTwo));
    expect(cmd._flags.name.length).toEqual(2);
    expect(cmd._flags[includeRemote]).toEqual(true);
    expect(cmd._flags.port).toEqual(3000);
    expect(cmd._flags[flexUiSource]).toBeUndefined();
  });

  it('should read the port flag', async () => {
    const cmd = await createCommand('--name', pluginNameOne, '--name', pluginNameTwo, '--port', '4000');

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValueOnce(4000);
    findPortAvailablePort.mockResolvedValueOnce(4100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    await cmd.run();

    expect(cmd._flags.name.includes(pluginNameOne));
    expect(cmd._flags.name.includes(pluginNameTwo));
    expect(cmd._flags.name.length).toEqual(2);
    expect(cmd._flags.port).toEqual(4000);
    expect(cmd._flags[flexUiSource]).toBeUndefined();
  });

  it('should read and set flex-ui-source', async () => {
    const flexUISrc = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
    const cmd = await createCommand('--flex-ui-source', flexUISrc);
    const encodedFlexUISrc = 'http%3A%2F%2Flocalhost%3A8080%2Ftwilio-flex-ui.dev.browser.js';

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValueOnce(3000);
    findPortAvailablePort.mockResolvedValueOnce(100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    await cmd.run();

    expect(cmd.pluginsConfig).toEqual(config);
    expect(cmd.runScript).toHaveBeenCalledTimes(4);
    expect(cmd.runScript).toHaveBeenCalledWith(preLocalRunCheck, [pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith('start', [
      'flex',
      '--name',
      pkg.name,
      '--port',
      '3000',
      '--plugin-config',
      JSON.stringify(pluginsConfig),
    ]);
    expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', pkg.name]);
    expect(cmd.spawnScript).toHaveBeenCalledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
    expect(cmd._flags[flexUiSource]).toEqual(encodedFlexUISrc);
    expect(env.getFlexUISrc()).toEqual(encodedFlexUISrc);
  });

  it('should error due to invalid flex-ui-source', async () => {
    const flexUISrc = 'invalid-flex-ui-source';
    const cmd = await createCommand('--flex-ui-source', flexUISrc);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioError);
      expect(e.message).toContain('is not a valid JS file');
      expect(env.getFlexUISrc()).toBeUndefined();
      expect(cmd._flags[flexUiSource]).toEqual(flexUISrc);
      expect(cmd.runScript).not.toHaveBeenCalled();
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should process the one plugin', async () => {
    const cmd = await createCommand('--name', pluginNameOne);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    await cmd.run();

    expect(cmd._flags.name.includes(pluginNameOne));
    expect(cmd._flags.name.length).toEqual(1);
    expect(cmd._flags[includeRemote]).toBeUndefined();
    expect(cmd._flags[flexUiSource]).toBeUndefined();
  });

  it('should throw an error due to a user inputted port being unavailable', async (done) => {
    const cmd = await createCommand('--name', pluginNameOne, '--port', '3000');

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValueOnce(3100);
    findPortAvailablePort.mockResolvedValueOnce(3200);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('already in use. Use --port to choose another port');
      expect(cmd.runScript).not.toHaveBeenCalled();
      expect(cmd.spawnScript).not.toHaveBeenCalled();

      done();
    }
  });

  it('should throw an error for no local plugins', async () => {
    const cmd = await createCommand('--name', 'plugin-testOne@remote');

    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('at least one local plugin');
      expect(cmd.runScript).not.toHaveBeenCalled();
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should throw an error if not in a plugin directory and no plugins given', async () => {
    const cmd = await createCommand();
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('not a flex plugin');
      expect(cmd._flags.name).toBeUndefined();
      expect(cmd._flags[includeRemote]).toBeUndefined();
      expect(cmd._flags[flexUiSource]).toBeUndefined();
    }
  });

  it('should have compatibility set', async () => {
    const cmd = await createCommand();

    expect(cmd.checkCompatibility).toEqual(true);
  });

  it('should return true if multiple plugins are provided', async () => {
    const cmd = await createCommand('--name', pluginNameOne, '--name', pluginNameTwo);

    jest.spyOn(cmd, 'isPluginFolder');

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return true if include-remote is set', async () => {
    const cmd = await createCommand('--include-remote');

    jest.spyOn(cmd, 'isPluginFolder');

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return false if no plugins', async () => {
    const cmd = await createCommand();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(false);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return false if plugin directory is set but is the same as the --name', async () => {
    const cmd = await createCommand('--name', pluginNameSample);

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    mockGetPkg(cmd, { name: pluginNameSample });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(false);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });

  it('should return true if plugin directory is and is different', async () => {
    const cmd = await createCommand('--name', pluginNameSample);

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, { name: 'plugin-another' });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });

  it('should error due to incorrectly formatted version input (semver)', async (done) => {
    const cmd = await createCommand('--name', 'plugin-testOne', '--name', `${name}@${badVersion}`);

    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('Version a.b.c is not a valid semver string.');
      expect(cmd.runScript).not.toHaveBeenCalled();
      expect(cmd.spawnScript).not.toHaveBeenCalled();

      done();
    }
  });

  it('should error due to incorrectly formatted version input (regex)', async (done) => {
    const cmd = await createCommand('--name', '!@!');

    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('Unexpected plugin format was provided.');
      expect(cmd.runScript).not.toHaveBeenCalled();
      expect(cmd.spawnScript).not.toHaveBeenCalled();

      done();
    }
  });

  it('should error due to version not found', async (done) => {
    const cmd = await createCommand('--name', 'plugin-testOne', '--name', `${name}@${goodVersion}`);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();

    const get = jest.fn().mockRejectedValue(new Error());

    try {
      // @ts-ignore
      jest.spyOn(cmd, 'pluginVersionsClient', 'get').mockReturnValue({ get });
      await cmd.run();
    } catch (e) {
      expect(e instanceof TwilioApiError).toEqual(true);
      expect(e.message).toContain(`Error finding plugin ${name} at version ${goodVersion}`);

      expect(get).toHaveBeenCalledTimes(1);
      done();
    }
  });

  it('should find the version of the plugin if available', async () => {
    const pluginVersionResource: PluginVersionResource = {
      archived: false,
      changelog: 'test',
      private: true,
      account_sid: 'AC00000000000000000000000000000',
      version: goodVersion,
      plugin_url: 'https://flex.twilio.com/plugins/plugin-test/2.0.0/bundle.js',
      sid: 'FV00000000000000000000000000000',
      date_created: '2021',
      plugin_sid: 'FP00000000000000000000000000000',
    };
    const cmd = await createCommand('--name', 'plugin-testOne', '--name', `${name}@${goodVersion}`);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(FlexPlugin.BUILDER_VERSION);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);
    jest.spyOn(cmd, 'checkForUpdate').mockReturnThis();
    const get = jest.fn().mockResolvedValue(pluginVersionResource);

    // @ts-ignore
    jest.spyOn(cmd, 'pluginVersionsClient', 'get').mockReturnValue({ get });

    await cmd.run();

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(name, goodVersion);
  });
});
