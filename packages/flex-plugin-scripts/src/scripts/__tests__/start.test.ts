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

describe('StartScript', () => {
  const paths = {
    cli: {
      pluginsJsonPath: '/cli/plugins/path',
    },
    app: {
      pluginsJsonPath: '/plugins/json/path',
      pkgPath: '/plugins/pkg/path',
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
    const writeFileSync = jest
      .spyOn(fs.default, 'writeFileSync');
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
      writeFileSync.mockReturnThis();
      _updatePluginPort.mockReturnThis();
      setCwd.mockReturnThis();
      process.env.PORT = port.toString();
    });

    afterAll(() => {
      findPort.mockRestore();
      getDefaultPort.mockRestore();
      _startDevServer.mockRestore();
      readPluginsJson.mockRestore();
      writeFileSync.mockRestore();
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
      const writeFileSync = jest
        .spyOn(fs.default, 'writeFileSync')
        .mockReturnThis();

      startScripts._updatePluginsUrl(port);

      expect(requirePackages).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(plugins[0].src.indexOf(port.toString()) !== -1).toBeTruthy();

      requirePackages.mockRestore();
      writeFileSync.mockRestore();
    });
  });

  describe('updatePluginsPort', () => {
    const readPluginsJson = jest
      .spyOn(fs, 'readPluginsJson');
    const writeFileSync = jest
      .spyOn(fs.default, 'writeFileSync');
    const _parseUserInputPlugins = jest
      .spyOn(startScripts, '_parseUserInputPlugins');
    const port = 1234;

    beforeEach(() => {
      _parseUserInputPlugins.mockReturnValue([{name: 'plugin-test', remote: false}]);
      readPluginsJson.mockReturnValue({plugins: [{name: 'plugin-test', dir: 'test-dir', port: 0}]});
      writeFileSync.mockReturnThis();
    });

    it('should update the plugin port', () => {
      startScripts._updatePluginPort(port, 'plugin-test');

      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('/cli/plugins/path', JSON.stringify({'plugins': [{name: 'plugin-test', dir: 'test-dir', port: 1234}]}, null, 2));
    });

    it('should not update the plugin port', () => {
      startScripts._updatePluginPort(port, 'plugin-bad-test');

      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('/cli/plugins/path', JSON.stringify({'plugins': [{name: 'plugin-test', dir: 'test-dir', port: 0}]}, null, 2));
    });
  });
});
