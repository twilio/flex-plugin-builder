import { Configuration } from 'webpack-dev-server';
import { WebpackType } from '..';
/**
 * Returns the base {@link Configuration}
 * @private
 */
export declare const _getBase: () => Configuration;
/**
 * Returns the {@link Configuration} for static type
 * @private
 */
export declare const _getStaticConfiguration: (config: Configuration) => Configuration;
/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
export declare const _getJavaScriptConfiguration: (config: Configuration) => Configuration;
declare const _default: (type: WebpackType) => Configuration;
/**
 * Generates a webpack-dev configuration
 */
export default _default;
