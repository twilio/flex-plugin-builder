import { env, logger, open } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import fs, { getPaths, FlexConfigurationPlugin, setCwd, readPluginsJson } from 'flex-dev-utils/dist/fs';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import { findPort, getDefaultPort, getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';

import getConfiguration, { ConfigurationType, WebpackType } from '../config';
import compiler from '../utils/compiler';

import run, { exit } from '../utils/run';
import pluginServer, { Plugin } from '../config/devServer/pluginServer';
import { writeFileSync } from 'fs';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

const _getPlugins = (...args: string[]) => {
  const localPlugins: FlexConfigurationPlugin[] = [];
  const remotePlugins: string[] = [];
  const config = readPluginsJson();
  let nameIndex = args.indexOf('--name');

  while (nameIndex !== -1 && nameIndex <= args.length) {
    if (nameIndex === args.length) {
      throw new FlexPluginError('You must put a plugin name after calling --name');
    } if (args[nameIndex + 1].includes('@remote')) {
      remotePlugins.push(args[nameIndex + 1].slice(0, args[nameIndex + 1].indexOf('@')));
    } else {
      const plugin = config.plugins.find((p) => p.name === args[nameIndex + 1]);
      if (!plugin) {
        throw new FlexPluginError('No plugin file was found with the given name');
      }
      localPlugins.push(plugin);
    }
    nameIndex = args.indexOf('--name', nameIndex + 1);
  }

  return {local: localPlugins, remote: remotePlugins};
}

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  addCWDNodeModule();

  // Finds the first available free port where two consecutive ports are free
  const port = await findPort(getDefaultPort(process.env.PORT));

  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);
  env.setHost('0.0.0.0');
  env.setPort(port);

  // Future  node version will silently consume unhandled exception
  process.on('unhandledRejection', err => { throw err; });
  const plugins = _getPlugins(...args);
  const localPlugins = plugins.local;
  const remotePlugins = plugins.remote;

  let type = WebpackType.Complete;
  if (args[0] === 'flex') {
    type = WebpackType.Static;

    // For some reason start flex sometimes throws this exception
    // I haven't been able to figure why but it doesn't look like it is crashing the server
    process.on('uncaughtException', (err) => {
      // @ts-ignore
      if (err.errno === 'ECONNRESET') {
        // do nothing
        return;
      }
      throw err;
    });
  }
  if (args[0] === 'plugin') {
    type = WebpackType.JavaScript;

    const plugin = localPlugins[0];
    if (plugin) {
      _updatePluginPort(port, plugin.name);
      setCwd(plugin.dir);
    }
  }

  let includeRemote = false;

  if (args.includes('--include-remote') || remotePlugins.length > 0) {
    includeRemote = true;
  }

  _startDevServer(port, localPlugins, remotePlugins, type, includeRemote);
};

/**
 * Starts the webpack dev-server
 * @param port  the port the server is running on
 * @privateAl
 */
/* istanbul ignore next */
export const _startDevServer = (port: number, localPlugins: FlexConfigurationPlugin[], remotePlugins: string[], type: WebpackType, includeRemote: boolean) => {
  const pluginNames: string[] = localPlugins.map((p) => p.name);
  const config = getConfiguration(ConfigurationType.Webpack, Environment.Development, type);
  const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development, type);
  if (type !== WebpackType.JavaScript) {
    // @ts-ignore
    devConfig.before = (app, server) => app.use('/plugins', pluginServer(server.options, includeRemote, pluginNames, remotePlugins));
  }
  const devCompiler = compiler(config, true, type);
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
  fs.writeFileSync(getPaths().app.pluginsJsonPath, JSON.stringify(plugins, null, 2));
};

/**
 * Update port of a plugin
 * @param port
 * @param names
 */
export const _updatePluginPort = (port: number, names: string) => {
  const config = readPluginsJson();
  config.plugins = config
  .plugins
  .map((plugin) => {
    if (names.includes(plugin.name)) {
      plugin.port = port;
    }

    return plugin;
  });

  writeFileSync(getPaths().cli.pluginsJsonPath, JSON.stringify(config, null, 2));
};

run(start);

export default start;
