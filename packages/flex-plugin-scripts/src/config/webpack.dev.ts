import { env, paths } from 'flex-dev-utils';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';
import { WebpackType } from './index';
import pluginServer from './devServer/pluginServer';

export const _getStaticConfiguration = (config: Configuration) => {
  config.contentBase =  [
    paths.app.publicDir,
    paths.scripts.devAssetsDir,
  ];
  config.contentBasePublicPath = '/';

  // @ts-ignore
  config.before = (app, server) => app.use('/plugins', pluginServer(server.options));

  return config;
}

export const _getJavaScriptConfiguration = (config: Configuration) => {
  const socket = env.getWSSocket();
  config.injectClient = false;

  // We're using native sockjs-node
  config.transportMode = 'ws';
  config.sockHost = socket.host;
  config.sockPath = socket.path;
  config.sockPort = socket.port;

  return config;
}

/**
 * Generates a webpack-dev configuration
 */
/* istanbul ignore next */
export default (type: WebpackType) => {
  const { local } = getLocalAndNetworkUrls(env.getPort());
  const socket = env.getWSSocket();

  const config: Configuration = {
    compress: true,
    clientLogLevel: 'none',
    publicPath: '/',
    watchContentBase: true,
    hot: true,
    // If path not found, load homepage, and let flex-ui handle the navigation -- NOT SURE ABT THIS ONE
    historyApiFallback: {
      disableDotRule: true,
      index: '/',
    },
    quiet: true,
    host: env.getHost(),
    port: env.getPort(),
    public: local.url,
  };

  if (type === WebpackType.Static) {
    return _getStaticConfiguration(config);
  }
  if (type === WebpackType.JavaScript) {
    return _getJavaScriptConfiguration(config);
  }

  return _getJavaScriptConfiguration(_getStaticConfiguration(config));
}
