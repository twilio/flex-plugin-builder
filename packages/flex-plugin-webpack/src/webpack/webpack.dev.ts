import { env } from 'flex-dev-utils';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';
import { WebpackType } from '../index';
import { getPaths } from 'flex-dev-utils/dist/fs';

/**
 * Returns the base {@link Configuration}
 * @private
 */
export const _getBase = (): Configuration => {
  const { local } = getLocalAndNetworkUrls(env.getPort());

  return {
    compress: true,
    clientLogLevel: 'none',
    quiet: true,
    host: env.getHost(),
    port: env.getPort(),
    public: local.url,
  };
};

/**
 * Returns the {@link Configuration} for static type
 * @private
 */
export const _getStaticConfiguration = (config: Configuration): Configuration => {
  config.contentBase =  [
    getPaths().app.publicDir,
    getPaths().scripts.devAssetsDir,
  ];
  config.contentBasePublicPath = '/';
  config.historyApiFallback = {
    disableDotRule: true,
    index: '/',
  };
  config.publicPath = '/';
  config.watchContentBase = true;

  return config;
}

/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
export const _getJavaScriptConfiguration = (config: Configuration): Configuration => {
  const socket = env.getWSSocket();
  config.injectClient = false;
  config.serveIndex = false;

  // We're using native sockjs-node
  config.transportMode = 'ws';
  config.sockHost = socket.host;
  config.sockPath = socket.path;
  config.sockPort = socket.port;

  // Hot reload
  config.hot = true;

  return config;
}

/**
 * Generates a webpack-dev configuration
 */
/* istanbul ignore next */
export default (type: WebpackType) => {
  const config = _getBase();

  if (type === WebpackType.Static) {
    return _getStaticConfiguration(config);
  }
  if (type === WebpackType.JavaScript) {
    return _getJavaScriptConfiguration(config);
  }

  return _getJavaScriptConfiguration(_getStaticConfiguration(config));
}
