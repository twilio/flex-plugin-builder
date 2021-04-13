/* eslint-disable import/no-unused-modules */
/* istanbul ignore file */

import webpack from 'webpack';

export enum WebpackType {
  Static = 'static',
  JavaScript = 'javascript',
  Complete = 'complete',
}

export { webpack };
export { Configuration as WebpackConfigurations, Compiler as WebpackCompiler } from 'webpack';
export { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';

export { default as webpackFactory } from './webpack/webpack.config';
export { default as webpackDevFactory } from './webpack/webpack.dev';
export { default as compiler, compilerRenderer } from './compiler';
export { default as webpackDevServer } from './devServer/webpackDevServer';
export { default as pluginServer, Plugin } from './devServer/pluginServer';
export {
  emitCompileComplete,
  IPCType,
  onIPCServerMessage,
  startIPCClient,
  startIPCServer,
} from './devServer/ipcServer';
