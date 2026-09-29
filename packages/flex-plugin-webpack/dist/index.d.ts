import webpack from 'webpack';
export declare enum WebpackType {
    Static = "static",
    JavaScript = "javascript",
    Complete = "complete"
}
export { webpack };
export { Configuration as WebpackConfigurations, Compiler as WebpackCompiler } from 'webpack';
export { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';
export { default as webpackFactory } from './webpack/webpack.config';
export { default as webpackDevFactory } from './webpack/webpack.dev';
export { default as compiler, compilerRenderer } from './compiler';
export { default as webpackDevServer } from './devServer/webpackDevServer';
export { default as pluginServer, Plugin, PluginsConfig, PLUGIN_INPUT_PARSER_REGEX } from './devServer/pluginServer';
export { emitCompileComplete, emitDevServerCrashed, emitAllCompilesComplete, IPCType, onIPCServerMessage, OnDevServerCrashedPayload, startIPCClient, startIPCServer, } from './devServer/ipcServer';
export { default as DelayRenderStaticPlugin } from './plugins/DelayRenderStaticPlugin';
