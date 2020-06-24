import { env, logger, open } from 'flex-dev-utils';
import paths from 'flex-dev-utils/dist/paths';
import fs from 'flex-dev-utils/dist/fs';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import { findPorts, getDefaultPort, getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';

import getConfiguration, { ConfigurationType } from '../config';
import compiler from '../utils/compiler';

import run, { exit } from '../utils/run';
import pluginServer, { Plugin } from './start/pluginServer';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts the dev-server
 */
const start = async (...args: string[]) => {
  logger.debug('Starting local development environment');

  addCWDNodeModule();

  // Finds the first available free port where two consecutive ports are free
  const port = await findPorts(getDefaultPort(process.env.PORT));

  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);
  env.setHost('0.0.0.0');
  env.setPort(port);

  // Future  node version will silently consume unhandled exception
  process.on('unhandledRejection', err => { throw err; });

  let isInternal = false;
  // I feel like this is probably wrong
  // Also the logic feels backwards to me
  if (process.argv.includes('flex')) { // This is redundant
    isInternal = false;
  } else if (process.argv.includes('plugin')) {
    isInternal = true;
  }

  _startDevServer(port, isInternal);
};

/**
 * Starts the webpack dev-server
 * @param port  the port the server is running on
 * @private
 */
/* istanbul ignore next */
export const _startDevServer = (port: number, isInternal: boolean) => {
  let config;
  let devConfig;
  if (isInternal) {
    config = getConfiguration(ConfigurationType.WebpackInternal, Environment.Development);
    devConfig = getConfiguration(ConfigurationType.DevServerInternal, Environment.Development);
  } else {
    config = getConfiguration(ConfigurationType.Webpack, Environment.Development);
    devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development);
  }
  const devCompiler = compiler(config, true);
  const devServer = new WebpackDevServer(devCompiler, devConfig);
  const { local } = getLocalAndNetworkUrls(port);

  // Show TS errors on browser
  devCompiler.hooks.tsCompiled.tap('afterTSCompile', (warnings, errors) => {
    if (warnings.length) {
      devServer.sockWrite(devServer.sockets, 'warnings', warnings);
    }
    if (errors.length) {
      devServer.sockWrite(devServer.sockets, 'errors', errors);
    }
  });

  // Start the dev-server
  devServer.listen(local.port, local.host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.clearTerminal();
    logger.notice('Starting development server...');

    _updatePluginsUrl(port);
    await pluginServer(port);
    await open(local.url);
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
  const { plugins, pkg } = _requirePackages(paths.app.pluginsJsonPath, paths.app.pkgPath);

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
  fs.writeFileSync(paths.app.pluginsJsonPath, JSON.stringify(plugins, null, 2));
};

run(start);

export default start;
