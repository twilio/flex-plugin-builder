/* istanbul ignore file */

export enum WebpackType {
  Static = 'static',
  JavaScript = 'javascript',
  Complete = 'complete',
}

export { Configuration as WebpackConfigurations } from 'webpack';
export { Configuration as WebpackDevConfigurations } from 'webpack-dev-server';

export { default as webpackFactory } from './webpack.config';
export { default as webpackDevFactory } from './webpack.dev';
