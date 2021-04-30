import { Environment } from 'flex-dev-utils/dist/env';
import { WebpackType, WebpackConfigurations, WebpackDevConfigurations } from 'flex-plugin-webpack';
import { JestConfigurations } from './jest.config';
export { WebpackType };
export declare enum ConfigurationType {
    Webpack = "webpack",
    DevServer = "devServer",
    Jest = "jest"
}
interface Configurations {
    webpackInternal: WebpackConfigurations;
    devServerInternal: WebpackDevConfigurations;
    webpack: WebpackConfigurations;
    devServer: WebpackDevConfigurations;
    jest: JestConfigurations;
}
/**
 * Returns the configuration; if customer has provided a webpack.config.js, then the generated
 * config is passed to their Function for modification
 * @param name  the configuration name
 * @param env   the environment
 * @param type  the webpack type
 */
declare const getConfiguration: <T extends ConfigurationType>(name: T, env: Environment, type?: WebpackType) => Promise<Configurations[T]>;
export default getConfiguration;
