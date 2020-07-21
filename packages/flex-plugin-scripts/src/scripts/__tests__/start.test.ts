import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as fs from 'flex-dev-utils/dist/fs';
import * as urlScripts from 'flex-dev-utils/dist/urls';
import * as startScripts from '../start';
import { WebpackType } from '../../config';
import { read } from 'fs';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/urls');
jest.mock('flex-dev-utils/dist/env');
jest.mock('flex-dev-utils/dist/require');

const CliPath = '/cli/plugins/path';
const AppPluginsJsonPath = '/plugins/json/path';
const AppPkgPath = '/plugins/pkg/path';

describe('StartScript', () => {
  const paths = {
    cli: {
      pluginsJsonPath: CliPath,
    },
    app: {
      pluginsJsonPath: AppPluginsJsonPath,
      pkgPath: AppPkgPath,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('default', () => {
    const port = 1234;
    const findPort = jest
      .spyOn(urlScripts, 'findPort');
    const getDefaultPort = jest
      .spyOn(urlScripts, 'getDefaultPort');
    const _startDevServer = jest
      .spyOn(startScripts, '_startDevServer');
    const readPluginsJson = jest
      .spyOn(fs, 'readPluginsJson');
    const _parseUserInputPlugins = jest
      .spyOn(startScripts, '_parseUserInputPlugins');
    const writeJSONFile = jest
      .spyOn(fs, 'writeJSONFile');
    const _updatePluginPort = jest
      .spyOn(startScripts, '_updatePluginPort');
    const setCwd = jest
      .spyOn(fs, 'setCwd');

    const assertTest = (type: WebpackType) => {
      expect(findPort).toHaveBeenCalledTimes(1);
      expect(findPort).toHaveBeenCalledWith(port);
      expect(getDefaultPort).toHaveBeenCalledTimes(1);
      expect(getDefaultPort).toHaveBeenCalledWith(port.toString());
      expect(_startDevServer).toHaveBeenCalledTimes(1);
      expect(_parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(_startDevServer).toHaveBeenCalledWith(port, [{name: 'plugin-test', remote: false}], type, false);
    }

    beforeEach(() => {
      findPort.mockResolvedValue(port);
      getDefaultPort.mockReturnValue(port);
      _startDevServer.mockReturnThis();
      readPluginsJson.mockReturnValue({plugins: [{name: 'plugin-test', dir: 'test-dir', port: 0}]});
      writeJSONFile.mockReturnThis();
      _updatePluginPort.mockReturnThis();
      setCwd.mockReturnThis();
      process.env.PORT = port.toString();
    });

    afterAll(() => {
      findPort.mockRestore();
      getDefaultPort.mockRestore();
      _startDevServer.mockRestore();
      readPluginsJson.mockRestore();
      writeJSONFile.mockRestore();
      _updatePluginPort.mockRestore();
      setCwd.mockRestore();
    });

    it('should start dev-server', async () => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-test', remote: false}]);

      await startScripts.default();

      assertTest(WebpackType.Complete);
    });

    it('should start static html page', async () => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-test', remote: false}]);

      await startScripts.default(...['flex']);

      assertTest(WebpackType.Static);
    });

    it('should start plugin', async () => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-test', remote: false}]);

      await startScripts.default(...['plugin', '--name', 'plugin-test']);

      assertTest(WebpackType.JavaScript);
      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(_updatePluginPort).toHaveBeenCalledTimes(1);
      expect(setCwd).toHaveBeenCalledTimes(1);
    });

    it('should not update port or set cwd', async () => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-bad', remote: false}]);

      await startScripts.default(...['plugin', '--name', 'plugin-bad']);

      expect(_startDevServer).toHaveBeenCalledWith(port, [{name: 'plugin-bad', remote: false}], WebpackType.JavaScript, false);
      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(_updatePluginPort).not.toHaveBeenCalled();
      expect(setCwd).not.toHaveBeenCalled();
    });
  });

  describe('_updatePluginsUrl', () => {
    const pkg = { name: 'plugin-test' };
    const port = 2345;

    it('should throw an error if plugin not found', (done) => {
      const plugins = [{
        phase: 3,
        name: 'plugin-test',
        src: 'broken url',
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });

      try {
        startScripts._updatePluginsUrl(port);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(requirePackages).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('find plugin');
        done();
      }
    });

    it('should throw an error if it fails to find local port', (done) => {
      const plugins = [{
        phase: 3,
        name: 'plugin-test',
        src: 'http://twilio.com/plugin-test.js',
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });

      try {
        startScripts._updatePluginsUrl(port);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(requirePackages).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('local port');
        done();
      }
    });

    it('should update plugins URL', () => {
      const plugins = [{
        phase: 3,
        name: 'plugin-test',
        src: 'http://localhost:1234/plugin-test.js',
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });
      const writeJSONFile = jest
        .spyOn(fs, 'writeJSONFile')
        .mockReturnThis();

      startScripts._updatePluginsUrl(port);

      expect(requirePackages).toHaveBeenCalledTimes(1);
      expect(writeJSONFile).toHaveBeenCalledTimes(1);
      expect(plugins[0].src.indexOf(port.toString()) !== -1).toBeTruthy();

      requirePackages.mockRestore();
      writeJSONFile.mockRestore();
    });
  });

  describe('updatePluginsPort', () => {
    const port = 1234;
    const plugin = { name: 'plugin-test', dir: 'test-dir', port: 0 };
    const readPluginsJson = jest
      .spyOn(fs, 'readPluginsJson');
    const writeJSONFile = jest
      .spyOn(fs, 'writeJSONFile');
    const _parseUserInputPlugins = jest
      .spyOn(startScripts, '_parseUserInputPlugins');

    beforeEach(() => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-test', remote: false}]);
      readPluginsJson.mockReturnValue({plugins: [plugin]});
      writeJSONFile.mockReturnThis();
    });

    afterAll(() => {
      readPluginsJson.mockRestore();
      _parseUserInputPlugins.mockRestore();
      writeJSONFile.mockRestore();
    });

    it('should update the plugin port', () => {
      startScripts._updatePluginPort(port, plugin.name);

      expect(writeJSONFile).toHaveBeenCalledTimes(1);
      expect(writeJSONFile).toHaveBeenCalledWith(CliPath, {'plugins': [ {...plugin, port}]});
    });

    it('should not update the plugin port', () => {
      startScripts._updatePluginPort(port, 'unknown-plugin');

      expect(writeJSONFile).toHaveBeenCalledTimes(1);
      expect(writeJSONFile).toHaveBeenCalledWith(CliPath, {'plugins': [ {...plugin}]});
    });
  });

  describe('_parseUserInputPlugins', () => {
    const plugin = { name: 'plugin-test', dir: 'test-dir', port: 0 };
    const readPluginsJson = jest
      .spyOn(fs, 'readPluginsJson');

    beforeEach(() => {
      readPluginsJson.mockReturnValue({plugins: [plugin]});
    });

    afterEach(() => {
      readPluginsJson.mockRestore();
    });

    it('should return the local plugins only if found', () => {
      const result = startScripts._parseUserInputPlugins(...['--name', 'plugin-test']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{'name': 'plugin-test', 'remote': false}]);
    });

    it('should always return the remote plugins', () => {
      const result = startScripts._parseUserInputPlugins(...['--name', 'plugin-test@remote']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{'name': 'plugin-test', 'remote': true}]);
    });

    it('should throw an error if local plugin is not found', (done) => {
      try {
        startScripts._parseUserInputPlugins(...['--name', 'plugin-unknown']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('No plugin file');
        done();
      }
    });

    it ('should throw an error if input is incorrect format', (done) => {
      try {
        startScripts._parseUserInputPlugins(...['--name', '!']);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('Unexpected plugin name format');
        done();
      }
    });
  });
});
