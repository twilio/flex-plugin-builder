import { fs, open } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { join } from 'path';
import run from '../../utils/run';
import pluginServer, { Plugin } from '../start/pluginServer';

/**
 * Extracts port from a localhost url
 *
 * @param url the localhost url
 * @private
 */
export const _getPort = (url: string) => {
  const matches = url.match(/localhost:(\d*)/);
  if (!matches) {
    throw new FlexPluginError(`Could not find a local port on url ${url}`);
  }

  return matches[1];
};

/**
 * Finds the port and localhost url from the argv
 *
 * @param argv
 * @private
 */
export const _getPortAndUrl = (...argv: string[]) => {
  const url = argv.find((a) => a.indexOf('localhost:') !== -1);
  if (!url) {
    throw new FlexPluginError('No localhost server was found running.');
  }

  return {
    url,
    port: _getPort(url),
  };
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
export const _replacePlugins = (port: string) => {
  const pluginsPath = join(process.cwd(), 'public', 'plugins.json');
  const pkgPath = join(process.cwd(), 'package.json');
  const { plugins, pkg } = _requirePackages(pluginsPath, pkgPath);

  const pluginIndex = plugins.findIndex((p) => p.src.indexOf(pkg.name) !== -1);
  const existingPort = _getPort(plugins[pluginIndex].src);

  // Replace port and re-write to file
  plugins[pluginIndex].src = plugins[pluginIndex].src.replace(existingPort, port);
  fs.writeFileSync(pluginsPath, JSON.stringify(plugins, null, 2));
};

/**
 * Dynamically updates the plugins.json file, and then opens the browser
 * @param argv
 */
const browser = async (...argv: string[]) => {
  const { url, port } = _getPortAndUrl(...argv);
  _replacePlugins(port);

  // Now open browser
  await open(url);
  // Run a dev-server plugin service to talk with Flex plugin service
  pluginServer(port);
};

run(browser);

export default browser;
