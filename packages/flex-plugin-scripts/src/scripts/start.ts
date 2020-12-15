import { env, logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { addCWDNodeModule, getPaths, readPluginsJson, setCwd, writeJSONFile } from 'flex-dev-utils/dist/fs';
import { findPort, getDefaultPort } from 'flex-dev-utils/dist/urls';
import {
  compiler,
  compilerRenderer,
  pluginServer,
  Plugin,
  emitCompileComplete,
  IPCType,
  onIPCServerMessage,
  startIPCClient,
  startIPCServer,
  webpackDevServer,
} from 'flex-plugin-webpack';

import getConfiguration, { ConfigurationType, WebpackType } from '../config';
import run from '../utils/run';
import { findFirstLocalPlugin, parseUserInputPlugins, UserInputPlugin } from '../utils/parser';

interface StartServerOptions {
  port: number;
  remoteAll: boolean;
  type: WebpackType;
}

export interface StartScript {
  port: number;
}

/**
 * requires packages
 *
 * @param pluginsPath   the plugins path
 * @param pkgPath       the package path
 * @private
 */
/* istanbul ignore next */
export const _requirePackages = (pluginsPath: string, pkgPath: string) => {
  const plugins = require(pluginsPath) as Plugin[];
  const pkg = require(pkgPath);

  return {
    plugins,
    pkg,
  };
};

/**
 * Update port of a plugin
 * @param port
 * @param name
 */
export const _updatePluginPort = (port: number, name: string) => {
  const config = readPluginsJson();
  config.plugins.forEach((plugin) => {
    if (plugin.name === name) {
      plugin.port = port;
    }
  });

  writeJSONFile(getPaths().cli.pluginsJsonPath, config);
};

/**
 * Starts the webpack dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
/* istanbul ignore next */
export const _startDevServer = async (
  plugins: UserInputPlugin[],
  options: StartServerOptions,
): Promise<StartScript> => {
  const { type, port, remoteAll } = options;
  const isJavaScriptServer = type === WebpackType.JavaScript;
  const isStaticServer = type === WebpackType.Static;
  const config = getConfiguration(ConfigurationType.Webpack, Environment.Development, type);
  const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development, type);

  const localPlugins = plugins.filter((p) => !p.remote);
  const pluginRequest = {
    local: localPlugins.map((p) => p.name),
    remote: plugins.filter((p) => p.remote).map((p) => p.name),
  };
  const hasRemote = pluginRequest.remote.length > 0 || options.remoteAll;

  // compiler render callbacks
  const { onCompile, onRemotePlugins } = compilerRenderer(port, pluginRequest.local, !isJavaScriptServer, hasRemote);

  // Setup plugin's server
  if (!isJavaScriptServer) {
    const pluginServerConfig = { port, remoteAll };
    pluginServer(pluginRequest, devConfig, pluginServerConfig, onRemotePlugins);
  }

  // Start IPC Server
  if (isStaticServer) {
    startIPCServer();
    // start-flex will be listening to compilation errors emitted by start-plugin
    onIPCServerMessage(IPCType.onCompileComplete, onCompile);
  }
  // Start IPC Client
  if (isJavaScriptServer) {
    startIPCClient();
  }

  // Pass either the default onCompile (for start-flex) or the event-emitter (for start-plugin)
  const devCompiler = compiler(config, true, isJavaScriptServer ? emitCompileComplete : onCompile);
  webpackDevServer(devCompiler, devConfig, type);

  return {
    port,
  };
};

/**
 * Finds the port
 * @param args
 */
export const findPortAvailablePort = async (...args: string[]) => {
  const portIndex = args.indexOf('--port');
  return portIndex === -1
    ? findPort(getDefaultPort(process.env.PORT))
    : Promise.resolve(parseInt(args[portIndex + 1], 10));
};

/**
 * Starts the dev-server
 */
export const start = async (...args: string[]): Promise<StartScript> => {
  logger.debug('Starting local development environment');

  addCWDNodeModule(...args);

  // Finds the first available free port where two consecutive ports are free
  const port = await findPortAvailablePort(...args);

  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);
  env.setHost('0.0.0.0');
  env.setPort(port);

  // Future  node version will silently consume unhandled exception
  process.on('unhandledRejection', (err) => {
    throw err;
  });

  const userInputPlugins = parseUserInputPlugins(true, ...args);
  const plugin = findFirstLocalPlugin(userInputPlugins);
  if (!plugin) {
    throw new FlexPluginError('You must run at least one plugin locally.');
  }

  let type = WebpackType.Complete;
  if (args[0] === 'flex') {
    type = WebpackType.Static;

    /*
     * For some reason start flex sometimes throws this exception
     * I haven't been able to figure why but it doesn't look like it is crashing the server
     */
    process.on('uncaughtException', (err) => {
      // @ts-ignore
      if (err.code === 'ECONNRESET') {
        // do nothing
        return;
      }
      throw err;
    });
  } else if (args[0] === 'plugin') {
    type = WebpackType.JavaScript;
    env.setWDSSocketPort(port);
  }

  setCwd(plugin.dir);
  if (type === WebpackType.Complete || type === WebpackType.JavaScript) {
    _updatePluginPort(port, plugin.name);
  }

  const options = {
    port,
    type,
    remoteAll: args.includes('--include-remote'),
  };

  return _startDevServer(userInputPlugins, options);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(start);

export default start;
