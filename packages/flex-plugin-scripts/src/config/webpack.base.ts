/// <reference path="../module.d.ts" />

import { paths, semver } from 'flex-dev-utils';
import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import ModuleScopePlugin from '@k88/module-scope-plugin';
import typescriptFormatter from '@k88/typescript-compile-error-formatter';
import { Environment } from 'flex-dev-utils/dist/env';
import { getDependencyVersion } from 'flex-dev-utils/dist/fs';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin, Loader,
  Plugin,
  Resolve,
  SourceMapDevToolPlugin,
} from 'webpack';

const EXTERNALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
};

/**
 * Returns an array of {@link Plugin} for Webpack
 * @param env the environment
 * @private
 */
export const _getPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];

  const flexUIVersion = getDependencyVersion('@twilio/flex-ui');
  const reactVersion = getDependencyVersion('react');
  const reactDOMVersion = getDependencyVersion('react-dom');

  plugins.push(new DefinePlugin({
    __FPB_PLUGIN_UNIQUE_NAME: `'${paths.app.name}'`,
    __FPB_PLUGIN_VERSION: `'${paths.app.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${flexUIVersion}'`,
    __FPB_REACT_VERSION: `'${reactVersion}'`,
    __FPB_REACT_DOM_VERSION: `'${reactDOMVersion}'`,
  }));

  return plugins;
};

/**
 * Main method for generating a base webpack configuration
 * @param env
 */
export default (env: Environment) => {
  const isProd = env === Environment.Production;

  const config: Configuration = {
    externals: EXTERNALS,
    plugins: _getPlugins(env),
  };
  config.mode = isProd ? Environment.Production : Environment.Development;

  return config;
};
