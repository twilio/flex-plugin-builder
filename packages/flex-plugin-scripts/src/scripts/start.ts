import { env, exit, logger } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { FlexPluginError } from '@twilio/flex-dev-utils/dist/errors';
import { addCWDNodeModule, setCwd } from '@twilio/flex-dev-utils/dist/fs';
import { findPort, getDefaultPort } from '@twilio/flex-dev-utils/dist/urls';
import {
  compiler,
  compilerRenderer,
  emitCompileComplete,
  emitDevServerCrashed,
  IPCType,
  onIPCServerMessage,
  Plugin,
  pluginServer,
  startIPCClient,
  startIPCServer,
  webpackDevServer,
  OnDevServerCrashedPayload,
  PluginsConfig,
  DelayRenderStaticPlugin,
} from '@twilio/flex-plugin-webpack';
import {
  compilerWp5,
  compilerRendererWp5,
  emitCompileCompleteWp5,
  emitDevServerCrashedWp5,
  IPCTypeWp5,
  onIPCServerMessageWp5,
  pluginServerWp5,
  startIPCClientWp5,
  startIPCServerWp5,
  webpackDevServerWp5,
  OnDevServerCrashedPayloadWp5,
  PluginsConfigWp5,
  DelayRenderStaticPluginWp5,
  WebpackTypeWp5,
} from '@twilio/flex-plugin-webpack5';

import getConfiguration, { ConfigurationType, getConfigurationForWp5, WebpackType } from '../config';
import run from '../utils/run';
import { findFirstLocalPlugin, parseUserInputPlugins, UserInputPlugin } from '../utils/parser';
import { serverCrashed } from '../prints';

interface StartServerOptions {
  port: number;
  remoteAll: boolean;
  type: WebpackType;
}

interface StartServerOptionsWp5 {
  port: number;
  remoteAll: boolean;
  type: WebpackTypeWp5;
}

export interface StartScript {
  port: number;
}

interface Packages {
  plugins: Plugin[];
  pkg: Record<string, string>;
}

/**
 * requires packages
 *
 * @param pluginsPath   the plugins path
 * @param pkgPath       the package path
 * @private
 */
/* c8 ignore next */
export const _requirePackages = (pluginsPath: string, pkgPath: string): Packages => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
  const plugins = require(pluginsPath) as Plugin[];
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
  const pkg = require(pkgPath);

  return {
    plugins,
    pkg,
  };
};

/**
 * Handles server crash
 * @param payload
 */
export const _onServerCrash = (payload: OnDevServerCrashedPayload): void => {
  serverCrashed(payload);
  exit(1);
};

/**
 * Handles server crash wp5
 * @param payload
 */
export const _onServerCrashWp5 = (payload: OnDevServerCrashedPayloadWp5): void => {
  serverCrashed(payload);
  exit(1);
};

/**
 * Parse the configuration
 * @param args
 * @returns
 */
export const _getPluginsConfiguration = (...args: string[]): PluginsConfig => {
  return JSON.parse(args[args.indexOf('--plugin-config') + 1]) as PluginsConfig;
};

/**
 * Parse the configuration for wp5
 * @param args
 * @returns
 */
export const _getPluginsConfigurationWp5 = (...args: string[]): PluginsConfigWp5 => {
  return JSON.parse(args[args.indexOf('--plugin-config') + 1]) as PluginsConfigWp5;
};
/**
 * Starts the webpack dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
/* c8 ignore next */
export const _startDevServer = async (
  plugins: UserInputPlugin[],
  options: StartServerOptions,
  pluginsConfig: PluginsConfig,
): Promise<StartScript> => {
  const { type, port, remoteAll } = options;
  const isJavaScriptServer = type === WebpackType.JavaScript;
  const isStaticServer = type === WebpackType.Static;
  const config = await getConfiguration(ConfigurationType.Webpack, Environment.Development, true, type);
  const devConfig = await getConfiguration(ConfigurationType.DevServer, Environment.Development, true, type);
  const localPlugins = plugins.filter((p) => !p.remote);
  const pluginRequest = {
    local: localPlugins.map((p) => p.name),
    remote: plugins
      .filter((p) => p.remote && !p.version && !localPlugins.some((l) => l.name === p.name))
      .map((p) => p.name),
    versioned: plugins
      .filter((p) => p.remote && p.version && !localPlugins.some((l) => l.name === p.name))
      .map((p) => `${p.name}@${p.version}`),
  };
  const hasRemote = pluginRequest.remote.length > 0 || pluginRequest.versioned.length > 0 || options.remoteAll;

  // compiler render callbacks
  const { onCompile, onRemotePlugins } = compilerRenderer(port, pluginRequest.local, !isJavaScriptServer, hasRemote);
  // Setup plugin's server
  if (!isJavaScriptServer) {
    const pluginServerConfig = { port, remoteAll };
    pluginServer(pluginRequest, devConfig, pluginServerConfig, onRemotePlugins, pluginsConfig);
  }

  // Start IPC Server
  if (isStaticServer) {
    config?.plugins?.push(new DelayRenderStaticPlugin());
    startIPCServer();
    // start-flex will be listening to compilation errors emitted by start-plugin
    onIPCServerMessage(IPCType.onCompileComplete, onCompile);
    onIPCServerMessage(IPCType.onDevServerCrashed, _onServerCrash);
  }

  // Start IPC Client
  if (isJavaScriptServer) {
    startIPCClient();
  }

  try {
    // Pass either the default onCompile (for start-flex) or the event-emitter (for start-plugin)
    const devCompiler = compiler(
      config,
      true,
      isJavaScriptServer,
      isJavaScriptServer ? emitCompileComplete : onCompile,
    );
    webpackDevServer(devCompiler, devConfig, type);
  } catch (err) {
    await emitDevServerCrashed(err);
  }

  return {
    port,
  };
};

/**
 * Starts the webpack 5 dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
/* c8 ignore next */
export const _startDevServerWp5 = async (
  plugins: UserInputPlugin[],
  options: StartServerOptionsWp5,
  pluginsConfig: PluginsConfigWp5,
): Promise<StartScript> => {
  logger.debug('Starting local development environment in wp5');
  const { type, port, remoteAll } = options;
  const isJavaScriptServer = type === WebpackTypeWp5.JavaScript;
  const isStaticServer = type === WebpackTypeWp5.Static;
  const config = await getConfigurationForWp5(ConfigurationType.Webpack, Environment.Development, true, type);
  const devConfig = await getConfigurationForWp5(ConfigurationType.DevServer, Environment.Development, true, type);
  const localPlugins = plugins.filter((p) => !p.remote);
  const pluginRequest = {
    local: localPlugins.map((p) => p.name),
    remote: plugins
      .filter((p) => p.remote && !p.version && !localPlugins.some((l) => l.name === p.name))
      .map((p) => p.name),
    versioned: plugins
      .filter((p) => p.remote && p.version && !localPlugins.some((l) => l.name === p.name))
      .map((p) => `${p.name}@${p.version}`),
  };
  const hasRemote = pluginRequest.remote.length > 0 || pluginRequest.versioned.length > 0 || options.remoteAll;

  // compiler render callbacks
  const { onCompile, onRemotePlugins } = compilerRendererWp5(port, pluginRequest.local, !isJavaScriptServer, hasRemote);
  // Setup plugin's server
  if (!isJavaScriptServer) {
    const pluginServerConfig = { port, remoteAll };
    pluginServerWp5(pluginRequest, devConfig, pluginServerConfig, onRemotePlugins, pluginsConfig);
  }

  // Start IPC Server
  if (isStaticServer) {
    config?.plugins?.push(new DelayRenderStaticPluginWp5());
    startIPCServerWp5();
    // start-flex will be listening to compilation errors emitted by start-plugin
    onIPCServerMessageWp5(IPCTypeWp5.onCompileComplete, onCompile);
    onIPCServerMessageWp5(IPCTypeWp5.onDevServerCrashed, _onServerCrashWp5);
  }

  // Start IPC Client
  if (isJavaScriptServer) {
    startIPCClientWp5();
  }

  try {
    // Pass either the default onCompile (for start-flex) or the event-emitter (for start-plugin)
    const devCompiler = compilerWp5(
      config,
      true,
      isJavaScriptServer,
      isJavaScriptServer ? emitCompileCompleteWp5 : onCompile,
    );
    webpackDevServerWp5(devCompiler, devConfig, type);
  } catch (err) {
    await emitDevServerCrashedWp5(err);
  }

  return {
    port,
  };
};

/**
 * Finds the port
 * @param args
 */
export const findPortAvailablePort = async (...args: string[]): Promise<number> => {
  const portIndex = args.indexOf('--port');
  return portIndex === -1
    ? findPort(getDefaultPort(process.env.PORT))
    : Promise.resolve(findPort(parseInt(args[portIndex + 1], 10)));
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
  let typeWp5 = WebpackTypeWp5.Complete;
  if (args[0] === 'flex') {
    type = WebpackType.Static;
    typeWp5 = WebpackTypeWp5.Static;
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
    typeWp5 = WebpackTypeWp5.JavaScript;
    env.setWDSSocketPort(port);
  }

  setCwd(plugin.dir);

  const options = {
    port,
    type,
    remoteAll: args.includes('--include-remote'),
  };

  const optionsWp5 = {
    port,
    typeWp5,
    remoteAll: args.includes('--include-remote'),
  };

  let pluginsConfig: PluginsConfig = {};
  let pluginsConfigWp5: PluginsConfigWp5 = {};
  if (type !== WebpackType.JavaScript && args.includes('--wp5')) {
    pluginsConfigWp5 = _getPluginsConfigurationWp5(...args);
  } else if (type !== WebpackType.JavaScript) {
    pluginsConfig = _getPluginsConfiguration(...args);
  }

  return args.includes('--wp5')
    ? _startDevServerWp5(userInputPlugins, { ...optionsWp5, type: typeWp5 }, pluginsConfigWp5)
    : _startDevServer(userInputPlugins, options, pluginsConfig);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(start);

// eslint-disable-next-line import/no-unused-modules
export default start;
