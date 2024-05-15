import { env } from '@twilio/flex-dev-utils';
import { getLocalAndNetworkUrls } from '@twilio/flex-dev-utils/dist/urls';
import { ClientConfiguration, Configuration, Static } from 'webpack-dev-server';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

import { WebpackType } from '..';

/**
 * Returns the base {@link Configuration}
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getBase = (): Configuration => {
  const { local } = getLocalAndNetworkUrls(env.getPort());

  return {
    compress: true,
    static: {},
    client: {
      logging: 'none',
      webSocketURL: {
        hostname: local.host,
        pathname: local.url,
        port: env.getPort(),
      },
    },
    host: env.getHost(),
    port: env.getPort(),
  };
};

/**
 * Returns the {@link Configuration} for static type
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getStaticConfiguration = (config: Configuration): Configuration => {
  config.historyApiFallback = {
    disableDotRule: true,
    index: '/',
  };
  config.static = [
    {
      directory: getPaths().app.publicDir,
      publicPath: '/',
      watch: true,
    },
    {
      directory: getPaths().scripts.devAssetsDir,
      publicPath: '/',
      watch: true,
    },
  ];

  return config;
};

/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getJavaScriptConfiguration = (config: Configuration): Configuration => {
  const socket = env.getWSSocket();

  (config.static as Static).serveIndex = true;
  // We're using native sockjs-node
  config.webSocketServer = 'ws';
  (config.client as ClientConfiguration).webSocketURL = {
    hostname: socket.host,
    pathname: socket.path,
    port: socket.port,
  };

  // Hot reload
  config.hot = false;

  return config;
};

/**
 * Generates a webpack-dev configuration
 */
/* c8 ignore next */
export default (type: WebpackType): Configuration => {
  const config = _getBase();

  if (type === WebpackType.Static) {
    return _getStaticConfiguration(config);
  }
  if (type === WebpackType.JavaScript) {
    return _getJavaScriptConfiguration(config);
  }

  return _getJavaScriptConfiguration(_getStaticConfiguration(config));
};
