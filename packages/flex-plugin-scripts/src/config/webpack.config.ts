import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import { getDependencyVersion } from 'flex-dev-utils/dist/fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, SourceMapDevToolPlugin, Plugin, DefinePlugin } from 'webpack';

import paths from '../utils/paths';
import { Environment } from './index';

const FLEX_SHIM = 'flex-plugin-scripts/dev_assets/flex-shim.js';
const EXTERNALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
};
const babelLoader = (isProd: boolean) => ({
  test: new RegExp('\.(' + paths.extensions.join('|') + ')$'),
  include: paths.appSrcDir,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    babelrc: false,
    configFile: false,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: { ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]' },
          },
        },
      ],
    ],
    compact: isProd,
  },
});

export const _getPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];

  plugins.push(new DefinePlugin({
    __FPB_PLUGIN_UNIQUE_NAME: `'${paths.packageName}'`,
    __FPB_PLUGIN_VERSION: `'${paths.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${getDependencyVersion('@twilio/flex-ui')}'`,
    __FPB_REACT_VERSION: `'${getDependencyVersion('react')}'`,
    __FPB_REACT_DOM_VERSION: `'${getDependencyVersion('react-dom')}'`,
  }));

  if (env === 'production') {
    plugins.push(new SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=bundle.js.map',
    }));
  }

  if (env === 'development') {
    const pkg = require(paths.flexUIPkgPath);
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: paths.indexHtmlPath,
    }));
    plugins.push(new InterpolateHtmlPlugin({
      TWILIO_FLEX_VERSION: pkg.version,
    }));
  }

  return plugins;
};

export default (env: Environment) => {
  const isProd = env === 'production';
  const config: Configuration = {
    entry: [
      paths.appEntryPath
    ],
    output: {
      path: paths.appBuildDir,
      filename: `${paths.packageName}.js`,
      publicPath: paths.appPublicDir,
    },
    bail: isProd,
    devtool: 'hidden-source-map',
    optimization: {
      splitChunks: false,
      runtimeChunk: false,
      minimize: isProd,
    },
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: paths.extensions.map(e => `.${e}`),
      alias: {
        '@twilio/flex-ui': FLEX_SHIM,
      }
    },
    externals: EXTERNALS,
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            babelLoader(isProd),
          ]
        },
      ]
    },
    plugins: _getPlugins(env),
  };
  config.mode = isProd ? 'production' : 'development';

  return config;
};
