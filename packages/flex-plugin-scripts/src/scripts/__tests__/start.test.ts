import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as exit from 'flex-dev-utils/dist/exit';
import * as fs from 'flex-dev-utils/dist/fs';
import * as urlScripts from 'flex-dev-utils/dist/urls';
import * as pluginServerScripts from 'flex-plugin-webpack/dist/devServer/pluginServer';
import * as devServerScripts from 'flex-plugin-webpack/dist/devServer/webpackDevServer';
import * as ipcServerScripts from 'flex-plugin-webpack/dist/devServer/ipcServer';
import * as compilerScripts from 'flex-plugin-webpack/dist/compiler';

import * as parserUtils from '../../utils/parser';
import * as startScripts from '../start';
import * as configScripts from '../../config';
import * as prints from '../../prints';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/urls');
jest.mock('flex-dev-utils/dist/env');
jest.mock('../../prints');

describe('StartScript', () => {
  const cliPath = '/cli/plugins/path';
  const pluginName = 'plugin-test';
  const isTSProject = jest.fn();
  const paths = {
    cli: {
      pluginsJsonPath: cliPath,
    },
    app: {
      pluginsJsonPath: '/plugins/json/path',
      pkgPath: '/plugins/pkg/path',
      isTSProject,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
    isTSProject.mockResolvedValue(true);
  });

  describe('default', () => {
    const port = 1234;
    const findPort = jest.spyOn(urlScripts, 'findPort');
    const getDefaultPort = jest.spyOn(urlScripts, 'getDefaultPort');
    const _startDevServer = jest.spyOn(startScripts, '_startDevServer');
    const readPluginsJson = jest.spyOn(fs, 'readPluginsJson');
    const parseUserInputPlugins = jest.spyOn(parserUtils, 'parseUserInputPlugins');
    const writeJSONFile = jest.spyOn(fs, 'writeJSONFile');
    const _updatePluginPort = jest.spyOn(startScripts, '_updatePluginPort');
    const setCwd = jest.spyOn(fs, 'setCwd');

    const assertTest = (type: configScripts.WebpackType) => {
      expect(findPort).toHaveBeenCalledTimes(1);
      expect(findPort).toHaveBeenCalledWith(port);
      expect(getDefaultPort).toHaveBeenCalledTimes(1);
      expect(getDefaultPort).toHaveBeenCalledWith(port.toString());
      expect(_startDevServer).toHaveBeenCalledTimes(1);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);
      expect(_startDevServer).toHaveBeenCalledWith([{ name: pluginName, remote: false }], {
        port,
        type,
        remoteAll: false,
      });
    };

    beforeEach(() => {
      findPort.mockResolvedValue(port);
      getDefaultPort.mockReturnValue(port);
      _startDevServer.mockReturnThis();
      readPluginsJson.mockReturnValue({ plugins: [{ name: pluginName, dir: 'test-dir', port: 0 }] });
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
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);

      await startScripts.default();

      assertTest(configScripts.WebpackType.Complete);
    });

    it('should start static html page', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);

      await startScripts.default(...['flex']);

      assertTest(configScripts.WebpackType.Static);
    });

    it('should start plugin', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);

      await startScripts.default(...['plugin', '--name', pluginName]);

      assertTest(configScripts.WebpackType.JavaScript);
      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(_updatePluginPort).toHaveBeenCalledTimes(1);
      expect(setCwd).toHaveBeenCalledTimes(1);
    });

    it('should throw exception if plugin is not found', async (done) => {
      parseUserInputPlugins.mockReturnValue([{ name: 'plugin-bad', remote: false }]);

      try {
        await startScripts.default(...['plugin', '--name', 'plugin-bad']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        done();
      }
    });
  });

  describe('updatePluginsPort', () => {
    const port = 1234;
    const plugin = { name: pluginName, dir: 'test-dir', port: 0 };
    const readPluginsJson = jest.spyOn(fs, 'readPluginsJson');
    const writeJSONFile = jest.spyOn(fs, 'writeJSONFile');
    const parseUserInputPlugins = jest.spyOn(parserUtils, 'parseUserInputPlugins');

    beforeEach(() => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);
      readPluginsJson.mockReturnValue({ plugins: [plugin] });
      writeJSONFile.mockReturnThis();
    });

    afterAll(() => {
      readPluginsJson.mockRestore();
      parseUserInputPlugins.mockRestore();
      writeJSONFile.mockRestore();
    });

    it('should update the plugin port', () => {
      startScripts._updatePluginPort(port, plugin.name);

      expect(writeJSONFile).toHaveBeenCalledTimes(1);
      expect(writeJSONFile).toHaveBeenCalledWith({ plugins: [{ ...plugin, port }] }, cliPath);
    });

    it('should not update the plugin port', () => {
      startScripts._updatePluginPort(port, 'unknown-plugin');

      expect(writeJSONFile).toHaveBeenCalledTimes(1);
      expect(writeJSONFile).toHaveBeenCalledWith({ plugins: [{ ...plugin }] }, cliPath);
    });
  });

  describe('_startDevServer', () => {
    const plugin = {
      name: 'plugin-name',
      remote: true,
    };
    const opts = {
      port: 1234,
      remoteAll: true,
    };
    const url = {
      url: 'http://localhost',
      port: opts.port,
      host: 'localhost',
    };

    const defaultOnCompile = jest.fn();
    const onRemotePlugins = jest.fn();
    const getConfiguration = jest.spyOn(configScripts, 'default');
    const getLocalAndNetworkUrls = jest.spyOn(urlScripts, 'getLocalAndNetworkUrls');
    const compiler = jest.spyOn(compilerScripts, 'default');
    const compilerRenderer = jest.spyOn(compilerScripts, 'compilerRenderer');
    const webpackDevServer = jest.spyOn(devServerScripts, 'default');
    const startIPCServer = jest.spyOn(ipcServerScripts, 'startIPCServer');
    const startIPCClient = jest.spyOn(ipcServerScripts, 'startIPCClient');
    const onIPCServerMessage = jest.spyOn(ipcServerScripts, 'onIPCServerMessage');
    const emitCompileComplete = jest.spyOn(ipcServerScripts, 'emitCompileComplete');
    const pluginServer = jest.spyOn(pluginServerScripts, 'default');

    beforeEach(() => {
      getConfiguration.mockReturnThis();
      getLocalAndNetworkUrls.mockReturnValue({ local: url, network: url });
      compiler.mockReturnThis();
      compilerRenderer.mockReturnValue({ onCompile: defaultOnCompile, onRemotePlugins });
      webpackDevServer.mockReturnThis();
      startIPCServer.mockReturnThis();
      startIPCClient.mockReturnThis();
      onIPCServerMessage.mockReturnThis();
      pluginServer.mockReturnThis();
    });

    it('should start pluginServer', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static });
      expect(pluginServer).toHaveBeenCalledTimes(1);

      pluginServer.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Complete });
      expect(pluginServer).toHaveBeenCalledTimes(1);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [], remote: [plugin.name] },
        expect.anything(),
        expect.anything(),
        onRemotePlugins,
      );
    });

    it('should not start pluginServer', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript });
      expect(pluginServer).not.toHaveBeenCalled();
    });

    it('should start ipc server', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static });
      expect(startIPCServer).toHaveBeenCalledTimes(1);
    });

    it('should not start ipc server', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Complete });
      expect(startIPCServer).not.toHaveBeenCalled();

      startIPCServer.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript });
      expect(startIPCServer).not.toHaveBeenCalled();
    });

    it('should start client server', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript });
      expect(startIPCClient).toHaveBeenCalledTimes(1);
    });

    it('should not start ipc client', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Complete });
      expect(startIPCClient).not.toHaveBeenCalled();

      startIPCClient.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static });
      expect(startIPCClient).not.toHaveBeenCalled();
    });

    it('should use emitter for javascript', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript });
      expect(compiler).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, emitCompileComplete as any);
    });

    it('should use default compiler for static/complete', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Complete });
      expect(compiler).toHaveBeenCalledTimes(1);
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, defaultOnCompile);

      compiler.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Complete });
      expect(compiler).toHaveBeenCalledTimes(1);
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, defaultOnCompile);
    });
  });

  describe('_onServerCrashed', () => {
    it('should print message and exit', () => {
      jest.spyOn(exit, 'default').mockReturnThis();

      const payload = {
        exception: {
          message: 'the-message',
          stack: 'the-line',
        },
      };
      startScripts._onServerCrash(payload);

      expect(prints.serverCrashed).toHaveBeenCalledTimes(1);
      expect(prints.serverCrashed).toHaveBeenCalledWith(payload);
      expect(exit.default).toHaveBeenCalledTimes(1);
      expect(exit.default).toHaveBeenCalledWith(1);
    });
  });
});
