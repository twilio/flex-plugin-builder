import { env, logger, open } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { getPaths, setCwd, readPluginsJson, writeJSONFile } from 'flex-dev-utils/dist/fs';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import { findPort, getDefaultPort, getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';

import getConfiguration, { ConfigurationType, WebpackType } from '../config';
import compiler from '../utils/compiler';

import run, { exit } from '../utils/run';
import pluginServer, { Plugin } from '../config/devServer/pluginServer';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
const PLUGIN_INPUT_PARSER_REGEX = /([\w-]+)(?:@(\S+))?/;

interface UserInputPlugin {
  name: string;
  remote: boolean;
  version?: string;
}

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  addCWDNodeModule(...args);

  // Finds the first available free port where two consecutive ports are free
  const port = await findPort(getDefaultPort(process.env.PORT));

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

  _startDevServer(port, userInputPlugins, type, args.includes('--include-remote'));
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
export const _startDevServer = (port: number, plugins: UserInputPlugin[], type: WebpackType, remoteAll: boolean) => {
  const config = getConfiguration(ConfigurationType.Webpack, Environment.Development, type);
  const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development, type);

  const localPlugins = plugins.filter(p => !p.remote);
  const pluginRequest = {
    local: localPlugins.map(p => p.name),
    remote: plugins.filter(p => p.remote).map(p => p.name),
  };

  // Setup plugin's server
  if (type !== WebpackType.JavaScript) {
    const pluginServerConfig = { port, remoteAll };
    pluginServer(pluginRequest, devConfig, pluginServerConfig);
  }

  const devCompiler = compiler(config, true, type, pluginRequest.local);
  const devServer = new WebpackDevServer(devCompiler, devConfig);
  const { local } = getLocalAndNetworkUrls(port);

  if (type !== WebpackType.Static) {
    // Show TS errors on browser
    devCompiler.hooks.tsCompiled.tap('afterTSCompile', (warnings, errors) => {
      if (warnings.length) {
        devServer.sockWrite(devServer.sockets, 'warnings', warnings);
      }
      if (errors.length) {
        devServer.sockWrite(devServer.sockets, 'errors', errors);
      }
    });
  }

  // Start the dev-server
  devServer.listen(local.port, local.host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.clearTerminal();
    const serverType = type === WebpackType.Complete ? '' : `(${type})`;
    logger.notice('Starting development server %s...', serverType);

    if (type !== WebpackType.Static) {
      _updatePluginsUrl(port);
    }

    if (type !== WebpackType.JavaScript) {
      await open(local.url);
    }
  });

  // Close server and exit
  const cleanUp = () => {
    devServer.close();
    exit(0);
  };

  termSignals.forEach((sig) => process.on(sig, cleanUp));
  if (!env.isCI()) {
    process.stdin.on('end', cleanUp);
    process.stdin.resume();
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
