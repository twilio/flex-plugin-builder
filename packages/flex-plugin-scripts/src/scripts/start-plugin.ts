import webpackPlugins from '../config/webpack.plugin';
import paths from 'flex-dev-utils/dist/paths';
import fs from 'flex-dev-utils/dist/fs';
import { Environment } from 'flex-dev-utils/dist/env';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { findPorts, getDefaultPort, getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import WebpackDevServer from 'webpack-dev-server';
import getConfiguration, { ConfigurationType } from '../config';
import compiler from '../utils/compiler';
import run from '../utils/run';
import { Plugin } from './start/pluginServer';
import { env } from 'flex-dev-utils';

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
 * Starts the webpack dev-server
 * @param port  the port the server is running on
 * @private
 */
/* istanbul ignore next */
export const _startDevServer = (port: number) => {
    const config = webpackPlugins(Environment.Development);
    const devConfig = getConfiguration(ConfigurationType.DevServer, Environment.Development);
    const devCompiler = compiler(config, true);
    const devServer = new WebpackDevServer(devCompiler, devConfig);
    const { local } = getLocalAndNetworkUrls(port);

    // Start the dev-server
    devServer.listen(local.port, local.host, async (err) => {
      _updatePluginsUrl(port);
    });
};

/**
 * Starts the dev server
 * @param args
 */
const startPlugins = async (...args: string[]) => {
  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);
  const port = await findPorts(getDefaultPort(process.env.PORT));

    _startDevServer(port)
};

run(startPlugins);

export default startPlugins;