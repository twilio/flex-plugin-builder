/* eslint-disable import/no-unused-modules */
/* c8 ignore start */

import webpack from 'webpack5';

export enum WebpackTypeWp5 {
  Static = 'static',
  JavaScript = 'javascript',
  Complete = 'complete',
}

export { webpack as webpack5 };
export { Configuration as WebpackConfigurationsWp5, Stats } from 'webpack5';
export { Configuration as WebpackDevConfigurationsWp5 } from 'webpack-dev-server-wp5';
export { default as webpackFactoryWp5 } from './webpack/webpack.config';
export { default as webpackDevFactoryWp5 } from './webpack/webpack.dev';
export { default as compilerWp5, compilerRenderer as compilerRendererWp5 } from './compiler';
export { default as webpackDevServerWp5 } from './devServer/webpackDevServer';
export {
  default as pluginServerWp5,
  Plugin as PluginWp5,
  PluginsConfig as PluginsConfigWp5,
  PLUGIN_INPUT_PARSER_REGEX,
} from './devServer/pluginServer';
export {
  emitCompileComplete as emitCompileCompleteWp5,
  emitDevServerCrashed as emitDevServerCrashedWp5,
  emitAllCompilesComplete as emitAllCompilesCompleteWp5,
  IPCType as IPCTypeWp5,
  onIPCServerMessage as onIPCServerMessageWp5,
  OnDevServerCrashedPayload as OnDevServerCrashedPayloadWp5,
  startIPCClient as startIPCClientWp5,
  startIPCServer as startIPCServerWp5,
} from './devServer/ipcServer';
export { default as DelayRenderStaticPluginWp5 } from './plugins/DelayRenderStaticPlugin';

/* c8 ignore stop */
