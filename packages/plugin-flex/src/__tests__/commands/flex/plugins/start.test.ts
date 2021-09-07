import * as pluginBuilderStartScript from 'flex-plugin-scripts/dist/scripts/start';
import { TwilioCliError, env, TwilioError } from 'flex-dev-utils';
import * as fs from 'flex-dev-utils/dist/fs';

import createTest, { mockGetPkg } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';

const includeRemote = 'include-remote';
const flexUiSource = 'flex-ui-source';

describe('Commands/FlexPluginsStart', () => {
  const preStartCheck = 'pre-start-check';
  const preScriptCheck = 'pre-script-check';
  const pluginNameSample = 'plugin-sample';
  const pluginNameOne = 'plugin-testOne';
  const pluginNameTwo = 'plugin-testTwo';
  const pluginNameBad = 'pluginBad';
  const pkg = {
    name: pluginNameOne,
    dependencies: {
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const badVersionPkg = {
    name: pluginNameBad,
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '3.9.9',
    },
    devDependencies: {},
  };
  const badPluginsPkg = {
    name: 'fakePlugin',
    devDependencies: {},
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const config = {
    plugins: [
      { name: pluginNameOne, dir: 'test-dir', port: 0 },
      { name: pluginNameTwo, dir: 'test-dir', port: 0 },
      { name: pluginNameBad, dir: 'test-dir', port: 0 },
    ],
  };

  let findPortAvailablePort = jest.spyOn(pluginBuilderStartScript, 'findPortAvailablePort');
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    process.env = { ...OLD_ENV };

    findPortAvailablePort = jest.spyOn(pluginBuilderStartScript, 'findPortAvailablePort');
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsStart.hasOwnProperty('flags')).toEqual(true);
  });

  it('should run start script for the directory plugin', async () => {
    const cmd = await createTest(FlexPluginsStart)();

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.doRun();

    expect(cmd.pluginsConfig).toEqual(config);
    expect(cmd.runScript).toHaveBeenCalledTimes(3);
    expect(cmd.runScript).toHaveBeenCalledWith('start', [
      'flex',
      '--name',
      pkg.name,
      '--port',
      3000,
      '--name-port',
      pkg.name,
      '100',
    ]);
    expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', pkg.name]);
    expect(cmd.spawnScript).toHaveBeenCalledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
  });

  it('should error due to bad versioning', async () => {
    const cmd = await createTest(FlexPluginsStart)();

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
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
      expect(cmd.runScript).toHaveBeenCalledTimes(2);
      expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', badVersionPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', badVersionPkg.name]);
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should error due to not being in the plugins.json file', async () => {
    const cmd = await createTest(FlexPluginsStart)();

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
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
      expect(cmd.runScript).toHaveBeenCalledTimes(2);
      expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', badPluginsPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', badPluginsPkg.name]);
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should read the name and include-remote flags', async () => {
    const cmd = await createTest(FlexPluginsStart)(
      '--name',
      pluginNameOne,
      '--name',
      pluginNameTwo,
      '--include-remote',
    );

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
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
    expect(cmd._flags[flexUiSource]).toBeUndefined();
  });

  it('should read and set flex-ui-source', async () => {
    const flexUISrc = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
    const cmd = await createTest(FlexPluginsStart)('--flex-ui-source', flexUISrc);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.run();

    expect(cmd.pluginsConfig).toEqual(config);
    expect(cmd.runScript).toHaveBeenCalledTimes(3);
    expect(cmd.runScript).toHaveBeenCalledWith('start', [
      'flex',
      '--name',
      pkg.name,
      '--port',
      3000,
      '--name-port',
      pkg.name,
      '100',
    ]);
    expect(cmd.runScript).toHaveBeenCalledWith(preStartCheck, ['--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith(preScriptCheck, ['--name', pkg.name]);
    expect(cmd.spawnScript).toHaveBeenCalledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
    expect(cmd._flags[flexUiSource]).toEqual(flexUISrc);
    expect(env.getFlexUISrc()).toEqual(flexUISrc);
  });

  it('should error due to invalid flex-ui-source', async () => {
    const flexUISrc = 'invalid-flex-ui-source';
    const cmd = await createTest(FlexPluginsStart)('--flex-ui-source', flexUISrc);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, pkg);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

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
    const cmd = await createTest(FlexPluginsStart)('--name', pluginNameOne);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJsonFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.run();

    expect(cmd._flags.name.includes(pluginNameOne));
    expect(cmd._flags.name.length).toEqual(1);
    expect(cmd._flags[includeRemote]).toBeUndefined();
    expect(cmd._flags[flexUiSource]).toBeUndefined();
  });

  it('should throw an error for no local plugins', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', 'plugin-testOne@remote');

    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);

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
    const cmd = await createTest(FlexPluginsStart)('');
    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);

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
    const cmd = await createTest(FlexPluginsStart)();

    expect(cmd.checkCompatibility).toEqual(true);
  });

  it('should return true if multiple plugins are provided', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', pluginNameOne, '--name', pluginNameTwo);

    jest.spyOn(cmd, 'isPluginFolder');

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return true if include-remote is set', async () => {
    const cmd = await createTest(FlexPluginsStart)('--include-remote');

    jest.spyOn(cmd, 'isPluginFolder');

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return false if no plugins', async () => {
    const cmd = await createTest(FlexPluginsStart)();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(false);
    expect(cmd.isPluginFolder).not.toHaveBeenCalled();
  });

  it('should return false if plugin directory is set but is the same as the --name', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', pluginNameSample);

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    mockGetPkg(cmd, { name: pluginNameSample });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(false);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });

  it('should return true if plugin directory is and is different', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', pluginNameSample);

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, { name: 'plugin-another' });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });
});
