import { readFileSync } from 'fs';
import { join } from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { Configuration as WebpackConfig, Plugin, Output, Options, Resolve } from 'webpack';
import merge from 'lodash.merge';
import clone from 'lodash.clonedeep';

import { loadFile } from '../utils/fs';

const appPath = join(process.cwd(), 'package.json');
const flexUIPath = join(process.cwd(), 'node_modules', '@twilio/flex-ui', 'package.json');
const appPkg = JSON.parse(readFileSync(appPath, 'utf8'));
const flexUIPkg = JSON.parse(readFileSync(flexUIPath, 'utf8'));
const TWILIO_FLEX_VERSION = flexUIPkg.version;

const UNSUPPORTED_PLUGINS = ['SWPrecacheWebpackPlugin', 'ManifestPlugin'];
const FLEX_SHIM = 'flex-plugin-scripts/dev_assets/flex-shim.js';

interface Configuration extends WebpackConfig {
  output: Output;
  plugins: Plugin[];
  optimization: Options.Optimization;
  resolve: Resolve;
}

/**
 * Configures webpack for building Flex plugins
 *
 * @param config  the {@link WebpackConfig}
 */
const configureWebpack = (config: WebpackConfig): Configuration => {
  config.output = config.output || {};
  config.plugins = config.plugins || [];
  config.optimization = config.optimization || {};
  config.resolve = config.resolve || {};

  config.output.filename = `${appPkg.name}.js`;
  config.output.chunkFilename = `[name].chunk.js`;
  config.plugins = config.plugins
    .filter((plugin: Plugin) => !UNSUPPORTED_PLUGINS.includes(plugin.constructor.name))
    .map((plugin: any) => {
      if (plugin.constructor.name === 'HtmlWebpackPlugin') {
        plugin.options.inject = false;
        plugin.options.hash = false;
      } else if (plugin.constructor.name === 'InterpolateHtmlPlugin') {
        plugin.replacements = {
          ...plugin.replacements,
          TWILIO_FLEX_VERSION,
        };
      }

      return plugin;
    });

  config.resolve.alias = {
    ...config.resolve.alias,
    '@twilio/flex-ui': FLEX_SHIM,
  };

  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
  };

  config.plugins.push(new CleanWebpackPlugin({
    cleanAfterEveryBuildPatterns: [
      join(process.cwd(), 'build/service-worker.js'),
      join(process.cwd(), 'build/precache-manifest*.js'),
      join(process.cwd(), 'build/index.html'),
    ],
  }));

  config.optimization.splitChunks = false;
  config.optimization.runtimeChunk = false;

  return config as Configuration;
};

export default {
  configure: (config: WebpackConfig): Configuration => {
    config = configureWebpack(config);

    // Now override if jest.config.js exists
    let webpackConfigOverride = loadFile(process.cwd(), 'webpack.config.js');
    if (webpackConfigOverride) {
      webpackConfigOverride = clone(webpackConfigOverride);
      delete webpackConfigOverride.devServer;
      config = merge({}, config, webpackConfigOverride);
    }

    return config as Configuration;
  },
};
