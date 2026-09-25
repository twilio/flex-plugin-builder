import { FlexPluginError } from '@twilio/flex-dev-utils/dist/errors';
import * as exit from '@twilio/flex-dev-utils/dist/exit';
import * as fs from '@twilio/flex-dev-utils/dist/fs';
import * as urlScripts from '@twilio/flex-dev-utils/dist/urls';
import * as pluginServerScripts from '@twilio/flex-plugin-webpack/dist/devServer/pluginServer';
import * as devServerScripts from '@twilio/flex-plugin-webpack/dist/devServer/webpackDevServer';
import * as ipcServerScripts from '@twilio/flex-plugin-webpack/dist/devServer/ipcServer';
import * as compilerScripts from '@twilio/flex-plugin-webpack/dist/compiler';
import { PluginsConfig } from '@twilio/flex-plugin-webpack';
import * as pluginServerScriptsWp5 from '@twilio/flex-plugin-webpack5/dist/devServer/pluginServer';
import * as devServerScriptsWp5 from '@twilio/flex-plugin-webpack5/dist/devServer/webpackDevServer';
import * as ipcServerScriptsWp5 from '@twilio/flex-plugin-webpack5/dist/devServer/ipcServer';
import * as compilerScriptsWp5 from '@twilio/flex-plugin-webpack5/dist/compiler';
import { PluginsConfigWp5, WebpackTypeWp5 } from '@twilio/flex-plugin-webpack5';

import * as parserUtils from '../../utils/parser';
import * as startScripts from '../start';
import * as configScripts from '../../config';
import * as prints from '../../prints';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('@twilio/flex-dev-utils/dist/urls');
jest.mock('@twilio/flex-dev-utils/dist/env');
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
    const _getPluginsConfiguration = jest.spyOn(startScripts, '_getPluginsConfiguration');
    const writeJSONFile = jest.spyOn(fs, 'writeJSONFile');
    const setCwd = jest.spyOn(fs, 'setCwd');

    const assertTest = (type: configScripts.WebpackType) => {
      expect(findPort).toHaveBeenCalledTimes(1);
      expect(findPort).toHaveBeenCalledWith(port);
      expect(getDefaultPort).toHaveBeenCalledTimes(1);
      expect(getDefaultPort).toHaveBeenCalledWith(port.toString());
      expect(_startDevServer).toHaveBeenCalledTimes(1);
      expect(parseUserInputPlugins).toHaveBeenCalledTimes(1);

      if (type === configScripts.WebpackType.JavaScript) {
        expect(_startDevServer).toHaveBeenCalledWith(
          [{ name: pluginName, remote: false }],
          {
            port,
            type,
            remoteAll: false,
          },
          {},
        );
        expect(_getPluginsConfiguration).toHaveBeenCalledTimes(0);
      } else {
        expect(_startDevServer).toHaveBeenCalledWith(
          [{ name: pluginName, remote: false }],
          {
            port,
            type,
            remoteAll: false,
          },
          { 'plugin-test': { port } },
        );
        expect(_getPluginsConfiguration).toHaveBeenCalledTimes(1);
      }
    };

    beforeEach(() => {
      findPort.mockResolvedValue(port);
      getDefaultPort.mockReturnValue(port);
      _startDevServer.mockReturnThis();
      readPluginsJson.mockReturnValue({ plugins: [{ name: pluginName, dir: 'test-dir' }] });
      writeJSONFile.mockReturnThis();
      setCwd.mockReturnThis();
      process.env.PORT = port.toString();
    });

    afterAll(() => {
      findPort.mockRestore();
      getDefaultPort.mockRestore();
      _startDevServer.mockRestore();
      readPluginsJson.mockRestore();
      writeJSONFile.mockRestore();
      setCwd.mockRestore();
      _getPluginsConfiguration.mockRestore();
    });

    it('should start dev-server', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);
      _getPluginsConfiguration.mockReturnValue({ [pluginName]: { port } });

      await startScripts.default();

      assertTest(configScripts.WebpackType.Complete);
    });

    it('should start static html page', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);
      _getPluginsConfiguration.mockReturnValue({ [pluginName]: { port } });

      await startScripts.default(...['flex']);

      assertTest(configScripts.WebpackType.Static);
    });

    it('should start plugin', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);

      await startScripts.default(...['plugin', '--name', pluginName]);

      assertTest(configScripts.WebpackType.JavaScript);
      expect(setCwd).toHaveBeenCalledTimes(1);
    });

    it('should throw exception if plugin is not found', async () => {
      parseUserInputPlugins.mockReturnValue([{ name: 'plugin-bad', remote: false }]);

      try {
        await startScripts.default(...['plugin', '--name', 'plugin-bad']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
      }
    });
  });

  describe('_startDevServer', () => {
    const plugin = {
      name: 'plugin-name',
      remote: true,
    };
    const pluginVersion = {
      name: 'plugin-name',
      remote: true,
      version: '1.0.0',
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
    const pluginsConfig = {
      'plugin-name': { port: 1234 },
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
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static }, pluginsConfig);
      expect(pluginServer).toHaveBeenCalledTimes(1);

      pluginServer.mockReset();
      await startScripts._startDevServer(
        [plugin],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(pluginServer).toHaveBeenCalledTimes(1);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [], remote: [plugin.name], versioned: [] },
        expect.anything(),
        expect.anything(),
        onRemotePlugins,
        pluginsConfig,
      );
    });

    it('should start pluginServer with versions', async () => {
      await startScripts._startDevServer(
        [pluginVersion],
        { ...opts, type: configScripts.WebpackType.Static },
        pluginsConfig,
      );
      expect(pluginServer).toHaveBeenCalledTimes(1);

      pluginServer.mockReset();
      await startScripts._startDevServer(
        [pluginVersion],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(pluginServer).toHaveBeenCalledTimes(1);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [], remote: [], versioned: [`${pluginVersion.name}@${pluginVersion.version}`] },
        expect.anything(),
        expect.anything(),
        onRemotePlugins,
        pluginsConfig,
      );
    });

    it('should start pluginServer with versioned and remote plugins that are not local', async () => {
      const pluginRemote = {
        name: 'plugin-name',
        remote: true,
      };
      const pluginLocal = {
        name: 'plugin-name',
        remote: false,
      };

      await startScripts._startDevServer(
        [pluginLocal, pluginRemote, pluginVersion],
        { ...opts, type: configScripts.WebpackType.Static },
        pluginsConfig,
      );
      expect(pluginServer).toHaveBeenCalledTimes(1);

      pluginServer.mockReset();
      await startScripts._startDevServer(
        [pluginLocal, pluginRemote, pluginVersion],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(pluginServer).toHaveBeenCalledTimes(1);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [pluginLocal.name], remote: [], versioned: [] },
        expect.anything(),
        expect.anything(),
        onRemotePlugins,
        pluginsConfig,
      );
    });

    it('should not start pluginServer', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript }, {});
      expect(pluginServer).not.toHaveBeenCalled();
    });

    it('should start ipc server', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static }, pluginsConfig);
      expect(startIPCServer).toHaveBeenCalledTimes(1);
    });

    it('should not start ipc server', async () => {
      await startScripts._startDevServer(
        [plugin],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(startIPCServer).not.toHaveBeenCalled();

      startIPCServer.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript }, {});
      expect(startIPCServer).not.toHaveBeenCalled();
    });

    it('should start client server', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript }, {});
      expect(startIPCClient).toHaveBeenCalledTimes(1);
    });

    it('should not start ipc client', async () => {
      await startScripts._startDevServer(
        [plugin],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(startIPCClient).not.toHaveBeenCalled();

      startIPCClient.mockReset();
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.Static }, pluginsConfig);
      expect(startIPCClient).not.toHaveBeenCalled();
    });

    it('should use emitter for javascript', async () => {
      await startScripts._startDevServer([plugin], { ...opts, type: configScripts.WebpackType.JavaScript }, {});
      expect(compiler).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, true, emitCompileComplete as any);
    });

    it('should use default compiler for static/complete', async () => {
      await startScripts._startDevServer(
        [plugin],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(compiler).toHaveBeenCalledTimes(1);
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, false, defaultOnCompile);

      compiler.mockReset();
      await startScripts._startDevServer(
        [plugin],
        { ...opts, type: configScripts.WebpackType.Complete },
        pluginsConfig,
      );
      expect(compiler).toHaveBeenCalledTimes(1);
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, false, defaultOnCompile);
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

  describe('_getPluginsConfiguration', () => {
    it('should return plugin configuration', () => {
      const obj: PluginsConfig = {
        pluginOne: {
          port: 100,
        },
        pluginTwo: {
          port: 200,
        },
      };
      const configStr = '{"pluginOne":{"port":100},"pluginTwo":{"port":200}}';
      const args = ['stuff', '--plugin-config', configStr];

      const config = startScripts._getPluginsConfiguration(...args);

      expect(config).toEqual(obj);
    });
  });
  describe('default with --wp5', () => {
    const port = 1234;
    const findPort = jest.spyOn(urlScripts, 'findPort');
    const getDefaultPort = jest.spyOn(urlScripts, 'getDefaultPort');
    const _startDevServer = jest.spyOn(startScripts, '_startDevServer');
    const _startDevServerWp5 = jest.spyOn(startScripts, '_startDevServerWp5');
    const parseUserInputPlugins = jest.spyOn(parserUtils, 'parseUserInputPlugins');
    const _getPluginsConfiguration = jest.spyOn(startScripts, '_getPluginsConfiguration');
    const _getPluginsConfigurationWp5 = jest.spyOn(startScripts, '_getPluginsConfigurationWp5');
    const setCwd = jest.spyOn(fs, 'setCwd');
    const readPluginsJson = jest.spyOn(fs, 'readPluginsJson');

    beforeEach(() => {
      findPort.mockResolvedValue(port);
      getDefaultPort.mockReturnValue(port);
      _startDevServer.mockReturnThis();
      _startDevServerWp5.mockReturnThis();
      setCwd.mockReturnThis();
      readPluginsJson.mockReturnValue({ plugins: [{ name: pluginName, dir: 'test-dir' }] });
      parseUserInputPlugins.mockReturnValue([{ name: pluginName, remote: false }]);
      process.env.PORT = port.toString();
    });

    afterAll(() => {
      findPort.mockRestore();
      getDefaultPort.mockRestore();
      _startDevServer.mockRestore();
      _startDevServerWp5.mockRestore();
      parseUserInputPlugins.mockRestore();
      _getPluginsConfiguration.mockRestore();
      _getPluginsConfigurationWp5.mockRestore();
      setCwd.mockRestore();
      readPluginsJson.mockRestore();
    });

    it('should start the webpack 5 dev-server with the wp5 plugins configuration', async () => {
      _getPluginsConfigurationWp5.mockReturnValue({ [pluginName]: { port } });

      await startScripts.default(...['--wp5']);

      expect(_startDevServer).not.toHaveBeenCalled();
      expect(_getPluginsConfiguration).not.toHaveBeenCalled();
      expect(_getPluginsConfigurationWp5).toHaveBeenCalledTimes(1);
      expect(_startDevServerWp5).toHaveBeenCalledTimes(1);
      expect(_startDevServerWp5).toHaveBeenCalledWith(
        [{ name: pluginName, remote: false }],
        expect.objectContaining({ port, type: WebpackTypeWp5.Complete, remoteAll: false }),
        { [pluginName]: { port } },
      );
    });

    it('should start a webpack 5 plugin without parsing a plugins configuration', async () => {
      await startScripts.default(...['plugin', '--name', pluginName, '--wp5']);

      expect(_getPluginsConfiguration).not.toHaveBeenCalled();
      expect(_getPluginsConfigurationWp5).not.toHaveBeenCalled();
      expect(_startDevServerWp5).toHaveBeenCalledTimes(1);
      expect(_startDevServerWp5).toHaveBeenCalledWith(
        [{ name: pluginName, remote: false }],
        expect.objectContaining({ port, type: WebpackTypeWp5.JavaScript, remoteAll: false }),
        {},
      );
    });

    it('should rethrow unhandled rejections and ignore ECONNRESET for start flex', async () => {
      _getPluginsConfigurationWp5.mockReturnValue({});
      const handlers: Record<string, (err: Error) => void> = {};
      const on = jest.spyOn(process, 'on').mockImplementation((event, handler) => {
        handlers[event as string] = handler as (err: Error) => void;
        return process;
      });

      await startScripts.default(...['flex', '--wp5']);

      const err = new Error('boom');
      expect(() => handlers.unhandledRejection(err)).toThrow(err);
      expect(() => handlers.uncaughtException(err)).toThrow(err);
      const reset = Object.assign(new Error('reset'), { code: 'ECONNRESET' });
      expect(() => handlers.uncaughtException(reset)).not.toThrow();

      on.mockRestore();
    });
  });

  describe('_startDevServerWp5', () => {
    const plugin = {
      name: 'plugin-name',
      remote: true,
    };
    const pluginVersion = {
      name: 'plugin-name',
      remote: true,
      version: '1.0.0',
    };
    const opts = {
      port: 1234,
      remoteAll: true,
    };
    const pluginsConfig = {
      'plugin-name': { port: 1234 },
    };

    const defaultOnCompile = jest.fn();
    const onRemotePlugins = jest.fn();
    const getConfigurationForWp5 = jest.spyOn(configScripts, 'getConfigurationForWp5');
    const compiler = jest.spyOn(compilerScriptsWp5, 'default');
    const compilerRenderer = jest.spyOn(compilerScriptsWp5, 'compilerRenderer');
    const webpackDevServer = jest.spyOn(devServerScriptsWp5, 'default');
    const startIPCServer = jest.spyOn(ipcServerScriptsWp5, 'startIPCServer');
    const startIPCClient = jest.spyOn(ipcServerScriptsWp5, 'startIPCClient');
    const onIPCServerMessage = jest.spyOn(ipcServerScriptsWp5, 'onIPCServerMessage');
    const emitCompileComplete = jest.spyOn(ipcServerScriptsWp5, 'emitCompileComplete');
    const emitDevServerCrashed = jest.spyOn(ipcServerScriptsWp5, 'emitDevServerCrashed');
    const pluginServer = jest.spyOn(pluginServerScriptsWp5, 'default');

    beforeEach(() => {
      getConfigurationForWp5.mockResolvedValue({ plugins: [] });
      compiler.mockReturnThis();
      compilerRenderer.mockReturnValue({ onCompile: defaultOnCompile, onRemotePlugins });
      webpackDevServer.mockReturnThis();
      startIPCServer.mockReturnThis();
      startIPCClient.mockReturnThis();
      onIPCServerMessage.mockReturnThis();
      emitDevServerCrashed.mockResolvedValue(undefined);
      pluginServer.mockReturnThis();
    });

    it('should start pluginServer with remote and versioned plugins', async () => {
      await startScripts._startDevServerWp5([plugin], { ...opts, type: WebpackTypeWp5.Complete }, pluginsConfig);
      expect(pluginServer).toHaveBeenCalledTimes(1);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [], remote: [plugin.name], versioned: [] },
        expect.anything(),
        { port: opts.port, remoteAll: opts.remoteAll },
        onRemotePlugins,
        pluginsConfig,
      );

      pluginServer.mockReset();
      await startScripts._startDevServerWp5([pluginVersion], { ...opts, type: WebpackTypeWp5.Complete }, pluginsConfig);
      expect(pluginServer).toHaveBeenCalledWith(
        { local: [], remote: [], versioned: [`${pluginVersion.name}@${pluginVersion.version}`] },
        expect.anything(),
        expect.anything(),
        onRemotePlugins,
        pluginsConfig,
      );
    });

    it('should not start pluginServer for javascript', async () => {
      await startScripts._startDevServerWp5([plugin], { ...opts, type: WebpackTypeWp5.JavaScript }, {});
      expect(pluginServer).not.toHaveBeenCalled();
    });

    it('should start the ipc server and add the delay plugin for static', async () => {
      const config = { plugins: [] };
      getConfigurationForWp5.mockResolvedValue(config);

      await startScripts._startDevServerWp5([plugin], { ...opts, type: WebpackTypeWp5.Static }, pluginsConfig);

      expect(startIPCServer).toHaveBeenCalledTimes(1);
      expect(startIPCClient).not.toHaveBeenCalled();
      expect(onIPCServerMessage).toHaveBeenCalledTimes(2);
      expect(onIPCServerMessage).toHaveBeenCalledWith(ipcServerScriptsWp5.IPCType.onCompileComplete, defaultOnCompile);
      expect(onIPCServerMessage).toHaveBeenCalledWith(
        ipcServerScriptsWp5.IPCType.onDevServerCrashed,
        startScripts._onServerCrashWp5,
      );
      expect(config.plugins).toHaveLength(1);
    });

    it('should start the ipc client and use the emitter for javascript', async () => {
      await startScripts._startDevServerWp5([plugin], { ...opts, type: WebpackTypeWp5.JavaScript }, {});

      expect(startIPCClient).toHaveBeenCalledTimes(1);
      expect(startIPCServer).not.toHaveBeenCalled();
      expect(compiler).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, true, emitCompileComplete as any);
    });

    it('should use the default compiler callback and start the dev-server for complete', async () => {
      const result = await startScripts._startDevServerWp5(
        [plugin],
        { ...opts, type: WebpackTypeWp5.Complete },
        pluginsConfig,
      );

      expect(startIPCServer).not.toHaveBeenCalled();
      expect(startIPCClient).not.toHaveBeenCalled();
      expect(compiler).toHaveBeenCalledWith(expect.any(Object), true, false, defaultOnCompile);
      expect(webpackDevServer).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ port: opts.port });
    });

    it('should emit dev-server crashed if the compiler throws', async () => {
      const err = new Error('compile-failed');
      compiler.mockImplementation(() => {
        throw err;
      });

      await startScripts._startDevServerWp5([plugin], { ...opts, type: WebpackTypeWp5.Complete }, pluginsConfig);

      expect(emitDevServerCrashed).toHaveBeenCalledTimes(1);
      expect(emitDevServerCrashed).toHaveBeenCalledWith(err);
      expect(webpackDevServer).not.toHaveBeenCalled();
    });
  });

  describe('_onServerCrashWp5', () => {
    it('should print message and exit', () => {
      jest.spyOn(exit, 'default').mockReturnThis();

      const payload = {
        exception: {
          message: 'the-message',
          stack: 'the-line',
        },
      };
      startScripts._onServerCrashWp5(payload);

      expect(prints.serverCrashed).toHaveBeenCalledTimes(1);
      expect(prints.serverCrashed).toHaveBeenCalledWith(payload);
      expect(exit.default).toHaveBeenCalledTimes(1);
      expect(exit.default).toHaveBeenCalledWith(1);
    });
  });

  describe('_getPluginsConfigurationWp5', () => {
    it('should return plugin configuration', () => {
      const obj: PluginsConfigWp5 = {
        pluginOne: {
          port: 100,
        },
        pluginTwo: {
          port: 200,
        },
      };
      const configStr = '{"pluginOne":{"port":100},"pluginTwo":{"port":200}}';
      const args = ['stuff', '--plugin-config', configStr];

      expect(startScripts._getPluginsConfigurationWp5(...args)).toEqual(obj);
    });
  });

  describe('_requirePackages', () => {
    it('should require the plugins and package json files', () => {
      const pkgPath = require.resolve('../../../package.json');
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
      const pkg = require(pkgPath);

      const result = startScripts._requirePackages(pkgPath, pkgPath);

      expect(result).toEqual({ plugins: pkg, pkg });
    });
  });
});
