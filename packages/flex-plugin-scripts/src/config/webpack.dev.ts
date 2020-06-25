import { env, paths } from 'flex-dev-utils';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';
import { WebpackType } from './index';
import pluginServer from './devServer/pluginServer';

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

export const _getStaticConfiguration = (config: Configuration) => {
  config.contentBase =  [
    paths.app.publicDir,
    paths.scripts.devAssetsDir,
  ];
  config.contentBasePublicPath = '/';
  config.historyApiFallback = {
    disableDotRule: true,
    index: '/',
  };
  config.publicPath = '/';
  config.watchContentBase = true;
  config.hot = true;

  // @ts-ignore
  config.before = (app, server) => app.use('/plugins', pluginServer(server.options));

  return config;
}

export const _getJavaScriptConfiguration = (config: Configuration) => {
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
