/// <reference types="src/module" />
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import webpack, { Configuration, Plugin, Resolve, RuleSetRule } from 'webpack';
import { WebpackType } from '..';
import Optimization = webpack.Options.Optimization;
/**
 * Returns the JS scripts to inject into the index.html file
 * @param flexUIVersion   the flex-ui version
 * @param reactVersion    the react version
 * @param reactDOMVersion the react-dom version
 */
export declare const _getJSScripts: (flexUIVersion: string, reactVersion: string, reactDOMVersion: string) => string[];
/**
 * Gets the image loader
 * @private
 */
export declare const _getImageLoader: () => RuleSetRule;
/**
 * Gets the styles loader
 * @param isProd  whether this is a production build
 * @private
 */
export declare const _getStyleLoaders: (isProd: boolean) => RuleSetRule[];
/**
 * Returns an array of {@link Plugin} for Webpack
 * @param environment the environment
 * @private
 */
export declare const _getBasePlugins: (environment: Environment) => Plugin[];
/**
 * Returns an array of {@link Plugin} for Webpack Static
 * @param environment
 */
export declare const _getStaticPlugins: (environment: Environment) => Plugin[];
/**
 * Returns an array of {@link Plugin} for Webpack Javascript
 * @param environment
 */
export declare const _getJSPlugins: (environment: Environment) => Plugin[];
/**
 * Returns the `entry` key of the webpack
 * @private
 */
export declare const _getJavaScriptEntries: () => string[];
/**
 * Returns the `optimization` key of webpack
 * @param environment the environment
 * @private
 */
export declare const _getOptimization: (environment: Environment) => Optimization;
/**
 * Returns the `resolve` key of webpack
 * @param environment the environment
 * @private
 */
export declare const _getResolve: (environment: Environment) => Resolve;
/**
 * Returns the base {@link Configuration}
 * @private
 */
export declare const _getBase: (environment: Environment) => Configuration;
/**
 * Returns the {@link Configuration} for static type
 * @private
 */
export declare const _getStaticConfiguration: (config: Configuration, environment: Environment) => Configuration;
/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
export declare const _getJavaScriptConfiguration: (config: Configuration, environment: Environment) => Configuration;
declare const _default: (environment: Environment, type: WebpackType) => Configuration;
/**
 * Main method for generating a webpack configuration
 * @param environment
 * @param type
 */
export default _default;
