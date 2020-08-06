import { env, logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { addCWDNodeModule, getPaths, readPluginsJson, setCwd, writeJSONFile } from 'flex-dev-utils/dist/fs';
import { findPort, getDefaultPort } from 'flex-dev-utils/dist/urls';

import getConfiguration, { ConfigurationType, WebpackType } from '../config';
import compiler, { onCompileComplete } from '../config/compiler';

import run from '../utils/run';
import pluginServer, { Plugin } from '../config/devServer/pluginServer';
import {
  emitCompileComplete,
  IPCType,
  onIPCServerMessage,
  startIPCClient,
  startIPCServer,
} from '../config/devServer/ipcServer';
import webpackDevServer from '../config/devServer/webpackDevServer';

const PLUGIN_INPUT_PARSER_REGEX = /([\w-]+)(?:@(\S+))?/;

interface UserInputPlugin {
  name: string;
  remote: boolean;
  version?: string;
}

interface StartServerOptions {
  port: number;
  remoteAll: boolean;
  type: WebpackType;
}

export interface StartScript {
  port: number;
}

/**
 * Finds the port
 * @param args
 */
export const findPortAvailablePort = (...args: string[]) => {
  const portIndex = args.indexOf('--port');
  return portIndex !== -1
      ? Promise.resolve(parseInt(args[portIndex + 1], 10))
      : findPort(getDefaultPort(process.env.PORT));
}


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
  process.on('unhandledRejection', err => { throw err; });

  const userInputPlugins = _parseUserInputPlugins(...args);
  const localPlugin = userInputPlugins.find(p => !p.remote);
  const plugin = localPlugin && readPluginsJson().plugins.find((p) => p.name === localPlugin.name);
  if (!plugin) {
    throw new FlexPluginError('You must run at least one plugin locally.');
  }

  let type = WebpackType.Complete;
  if (args[0] === 'flex') {
    type = WebpackType.Static;

    // For some reason start flex sometimes throws this exception
    // I haven't been able to figure why but it doesn't look like it is crashing the server
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

/**
 * Starts the webpack dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
/* istanbul ignore next */
export const _startDevServer = async (plugins: UserInputPlugin[], options: StartServerOptions): Promise<StartScript> => {
  const { type, port, remoteAll } = options;
  const isJavaScriptServer = type === WebpackType.JavaScript;
  const isStaticServer = type === WebpackType.Static;
  const config = getConfiguration(ConfigurationType.Webpack, Environment.Development, type);
  const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development, type);

  const localPlugins = plugins.filter(p => !p.remote);
  const pluginRequest = {
    local: localPlugins.map(p => p.name),
    remote: plugins.filter(p => p.remote).map(p => p.name),
  };

  // Setup plugin's server
  if (!isJavaScriptServer) {
    const pluginServerConfig = { port, remoteAll };
    pluginServer(pluginRequest, devConfig, pluginServerConfig);
  }

  // onComplication complete callback
  const onCompile = onCompileComplete(port, pluginRequest.local, !isJavaScriptServer);

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
  }
};

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
 * Replaces the port in plugins.json and re-writes ito the file
 *
 * @param port  the port to update to
 * @private
 */
export const _updatePluginsUrl = (port: number) => {
  const { plugins, pkg } = _requirePackages(getPaths().app.pluginsJsonPath, getPaths().app.pkgPath);

  const pluginIndex = plugins.findIndex((p) => p.src.indexOf(pkg.name) !== -1);
  if (pluginIndex === -1) {
    throw new FlexPluginError(`Could not find plugin ${pkg.name}`);
  }
  const url = plugins[pluginIndex].src;
  const matches = url.match(/localhost:(\d*)/);
  if (!matches) {
    throw new FlexPluginError(`Could not find a local port on url ${url}`);
  }

  // Replace port and re-write to file
  plugins[pluginIndex].src = plugins[pluginIndex].src.replace(matches[1], port.toString());
  writeJSONFile(getPaths().app.pluginsJsonPath, plugins);
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
 * Reads user input to returns the --name plugins
 * --name plugin-test will run plugin-test locally
 * --name plugin-test@remote will run plugin-test remotely
 * --include-remote will include all remote plugins
 * @param args
 */
export const _parseUserInputPlugins = (...args: string[]): UserInputPlugin[] => {
  const userInputPlugins: UserInputPlugin[] = [];
  const config = readPluginsJson();

  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] !== '--name') {
      continue;
    }
    const groups = args[i + 1].match(PLUGIN_INPUT_PARSER_REGEX);
    if (!groups) {
      throw new Error('Unexpected plugin name format was provided');
    }

    const name = groups[1];
    const version = groups[2]; // later we'll use this for the @1.2.3 use case as well

    if (version === 'remote') {
      userInputPlugins.push({name, remote: true});
      continue;
    }

    const plugin = config.plugins.find((p) => p.name === name);
    if (!plugin) {
      throw new FlexPluginError(`No plugin file was found with the name \'${name}\'`);
    }
    userInputPlugins.push({name: plugin.name, remote: false});
  }

  return userInputPlugins;
};

run(start);

export default start;
