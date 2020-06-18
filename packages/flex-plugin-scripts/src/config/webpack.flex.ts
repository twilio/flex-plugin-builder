/// <reference path="../module.d.ts" />

import webpackBaseFactory from './webpack.base';
import { Environment } from 'flex-dev-utils/dist/env';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import { paths, semver } from 'flex-dev-utils';
import { getDependencyVersion } from 'flex-dev-utils/dist/fs';
import { HotModuleReplacementPlugin, Plugin } from 'webpack';

/**
 * Returns the JS scripts to inject into the index.html file
 * @param flexUIVersion   the flex-ui version
 * @param reactVersion    the react version
 * @param reactDOMVersion the react-dom version
 */
export const _getJSScripts = (flexUIVersion: string, reactVersion: string, reactDOMVersion: string): string[] => {
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
 * Returns an array of {@link Plugin} for Webpack
 * @param env the environment
 * @private
 */
export const _getPlugins = (env: Environment): Plugin[] => {
    const plugins: Plugin[] = [];

    const flexUIVersion = getDependencyVersion('@twilio/flex-ui');
    const reactVersion = getDependencyVersion('react');
    const reactDOMVersion = getDependencyVersion('react-dom');

    // index.html entry point
    if (env === Environment.Development) {
      plugins.push(new HotModuleReplacementPlugin());
      plugins.push(new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: paths.app.indexHtmlPath,
      }));
      plugins.push(new InterpolateHtmlPlugin({
        __FPB_JS_SCRIPTS: _getJSScripts(flexUIVersion, reactVersion, reactDOMVersion).join('\n'),
      }));
    }

    return plugins;
};

/**
 * Main method for generating a flex webpack configuration
 * @param env
 */
export default (env: Environment) => {
    const config = webpackBaseFactory(env);

    config.plugins = config.plugins ? config.plugins : [];
    config.plugins.push(..._getPlugins(env));

   return config;
};