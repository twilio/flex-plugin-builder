import * as pluginBuilderStartScript from 'flex-plugin-scripts/dist/scripts/start';

import createTest, { mockGetPkg } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';
import { TwilioCliError } from '../../../../exceptions';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  // const { sinon, start } = createTest(FlexPluginsStart);
  const pkg = {
    name: 'plugin-testOne',
    dependencies: {
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const badVersionPkg = {
    name: 'pluginBad',
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
      { name: 'plugin-testOne', dir: 'test-dir', port: 0 },
      { name: 'plugin-testTwo', dir: 'test-dir', port: 0 },
      { name: 'pluginBad', dir: 'test-dir', port: 0 },
    ],
  };

  let findPortAvailablePort = jest.spyOn(pluginBuilderStartScript, 'findPortAvailablePort');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

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
    jest.spyOn(fs, 'readJSONFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.doRun();

    expect(cmd.pluginsConfig).toEqual(config);
    expect(cmd.runScript).toHaveBeenCalledTimes(3);
    expect(cmd.runScript).toHaveBeenCalledWith('start', ['flex', '--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-start-check', ['--name', pkg.name]);
    expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check', ['--name', pkg.name]);
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
    jest.spyOn(fs, 'readJSONFile').mockReturnValue(badVersionPkg);
    findPortAvailablePort.mockResolvedValue(100);

    try {
      await cmd.run();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('is not compatible');
      expect(cmd._flags.name).toBeUndefined();
      expect(cmd._flags['include-remote']).toBeUndefined();
      expect(cmd.runScript).toHaveBeenCalledTimes(2);
      expect(cmd.runScript).toHaveBeenCalledWith('pre-start-check', ['--name', badVersionPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check', ['--name', badVersionPkg.name]);
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
      expect(cmd._flags['include-remote']).toBeUndefined();
      expect(cmd.runScript).toHaveBeenCalledTimes(2);
      expect(cmd.runScript).toHaveBeenCalledWith('pre-start-check', ['--name', badPluginsPkg.name]);
      expect(cmd.runScript).toHaveBeenCalledWith('pre-script-check', ['--name', badPluginsPkg.name]);
      expect(cmd.spawnScript).not.toHaveBeenCalled();
    }
  });

  it('should read the name and include-remote flags', async () => {
    const cmd = await createTest(FlexPluginsStart)(
      '--name',
      'plugin-testOne',
      '--name',
      'plugin-testTwo',
      '--include-remote',
    );

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJSONFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.run();

    expect(cmd._flags.name.includes('plugin-testOne'));
    expect(cmd._flags.name.includes('plugin-testTwo'));
    expect(cmd._flags.name.length).toEqual(2);
    expect(cmd._flags['include-remote']).toEqual(true);
  });

  it('should process the one plugin', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', 'plugin-testOne');

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'runScript').mockReturnThis();
    jest.spyOn(cmd, 'spawnScript').mockReturnThis();
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    jest.spyOn(cmd, 'pluginsConfig', 'get').mockReturnValue(config);
    jest.spyOn(fs, 'readJSONFile').mockReturnValue(pkg);
    findPortAvailablePort.mockResolvedValue(100);

    await cmd.run();

    expect(cmd._flags.name.includes('plugin-testOne'));
    expect(cmd._flags.name.length).toEqual(1);
    expect(cmd._flags['include-remote']).toBeUndefined();
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
      expect(cmd._flags['include-remote']).toBeUndefined();
    }
  });

  it('should have compatibility set', async () => {
    const cmd = await createTest(FlexPluginsStart)();

    expect(cmd.checkCompatibility).toEqual(true);
  });

  it('should return true if multiple plugins are provided', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', 'plugin-testOne', '--name', 'plugin-testTwo');

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
    const cmd = await createTest(FlexPluginsStart)('--name', 'plugin-sample');

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(false);
    mockGetPkg(cmd, { name: 'plugin-sample' });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(false);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });

  it('should return true if plugin directory is and is different', async () => {
    const cmd = await createTest(FlexPluginsStart)('--name', 'plugin-sample');

    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    mockGetPkg(cmd, { name: 'plugin-another' });

    // @ts-ignore
    expect(cmd.isMultiPlugin()).toEqual(true);
    expect(cmd.isPluginFolder).toHaveBeenCalledTimes(1);
  });
});
