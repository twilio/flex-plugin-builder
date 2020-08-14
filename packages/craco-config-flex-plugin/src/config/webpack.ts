import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import { semver } from 'flex-dev-utils';
import { readFileSync } from 'fs';
import { join } from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import {
  Configuration as WebpackConfig,
  Plugin,
  Output,
  Options,
  Resolve,
  SourceMapDevToolPlugin,
  RuleSetLoader, Module,
} from 'webpack';
import { merge, clone } from 'flex-dev-utils/dist/lodash';
import { getDependencyVersion, readPackageJson } from 'flex-dev-utils/dist/fs';
import { DefinePlugin } from 'webpack';

import { loadFile } from '../utils/fs';

const appPath = join(process.cwd(), 'package.json');
const flexUIPath = join(process.cwd(), 'node_modules', '@twilio/flex-ui', 'package.json');
const reactPath = join(process.cwd(), 'node_modules', 'react', 'package.json');
const reactDomPath = join(process.cwd(), 'node_modules', 'react-dom', 'package.json');
const appPkg = JSON.parse(readFileSync(appPath, 'utf8'));

const FLEX_UI_VERSION = JSON.parse(readFileSync(flexUIPath, 'utf8')).version;
const REACT_VERSION = JSON.parse(readFileSync(reactPath, 'utf8')).version;
const REACT_DOM_VERSION = JSON.parse(readFileSync(reactDomPath, 'utf8')).version;

const UNSUPPORTED_PLUGINS = ['SWPrecacheWebpackPlugin', 'ManifestPlugin'];
const FLEX_SHIM = 'flex-plugin-scripts/dev_assets/flex-shim.js';
const CSS_EXTRACT = 'mini-css-extract-plugin';

interface Configuration extends WebpackConfig {
  module: Module;
  output: Output;
  plugins: Plugin[];
  optimization: Options.Optimization;
  resolve: Resolve;
}

/**
 * Returns the JS scripts to inject into the index.html file
 * @param flexUIVersion   the flex-ui version
 * @param reactVersion    the react version
 * @param reactDOMVersion the react-dom version
 */
export const getJSScripts = (flexUIVersion: string, reactVersion: string, reactDOMVersion: string): string[] => {
  if (!semver.satisfies(flexUIVersion, '>=1.19.0')) {
    return [
      `<script src="https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.min.js"></script>`,
    ];
  }

  return [
    `<script crossorigin src="https://unpkg.com/react@${reactVersion}/umd/react.development.js"></script>`,
    `<script crossorigin src="https://unpkg.com/react-dom@${reactDOMVersion}/umd/react-dom.development.js"></script>`,
    `<script src="https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.unbundled-react.min.js"></script>`,
  ];
};

/**
 * Configures webpack for building Flex plugins
 *
 * @param config  the {@link WebpackConfig}
 */
const configureWebpack = (config: WebpackConfig): Configuration => {
  addCWDNodeModule();

  const JSScripts = getJSScripts(FLEX_UI_VERSION, REACT_VERSION, REACT_DOM_VERSION);
  config.output = config.output || {};
  config.plugins = config.plugins || [];
  config.optimization = config.optimization || {};
  config.resolve = config.resolve || {};
  config.devtool = 'hidden-source-map';

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
          FPM_JS_SCRIPTS: JSScripts.join('\n'),
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
  config.plugins.push(new SourceMapDevToolPlugin({
    append: '\n//# sourceMappingURL=bundle.js.map',
  }));
  const pkg = readPackageJson();
  config.plugins.push(new DefinePlugin({
    __FPB_PLUGIN_UNIQUE_NAME: `'${pkg.name}'`,
    __FPB_PLUGIN_VERSION: `'${pkg.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('flex-plugin')}'`,
    __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('craco-config-flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${getDependencyVersion('@twilio/flex-ui')}'`,
    __FPB_REACT_VERSION: `'${getDependencyVersion('react')}'`,
    __FPB_REACT_DOM_VERSION: `'${getDependencyVersion('react-dom')}'`,
  }));

  config.optimization.splitChunks = false;
  config.optimization.runtimeChunk = false;

  // Allow CSS to be bundled into the minified JS
  if (config.module && config.module.rules && config.mode === 'production') {
    config.module.rules
      .filter(rule => rule.oneOf)
      .forEach(oneOf => {
        (oneOf.oneOf || [])
          .filter(rule => rule.use)
          .map(rule => rule.use as RuleSetLoader[])
          .forEach(use => {
            const index = use.findIndex(u => u.loader && u.loader.indexOf(CSS_EXTRACT) !== -1);
            if (index !== -1) {
              use.splice(index, 1);
              // @ts-ignore
              use.unshift(require.resolve('style-loader'));
            }
          });
      });
  }

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
