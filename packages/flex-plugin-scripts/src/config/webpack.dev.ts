import { env, paths } from 'flex-dev-utils';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';

/**
 * Generates a webpack-dev configuration
 */
/* istanbul ignore next */
export default (isInternal: boolean) => {
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

    // this is used to optimize cpu
    // watchOptions: {
    // //  ignored: ignoredFiles(paths.appSrc),
    // },

    host: env.getHost(),
    port: env.getPort(),
    public: local.url,
  };

  if (isInternal) {
    config.contentBase =  [
      paths.app.publicDir,
      paths.scripts.devAssetsDir,
    ];
    config.contentBasePublicPath = '/';
  } else {
    config.quiet = true;
    config.injectClient = false;

    // We're using native sockjs-node
    config.transportMode = 'ws';
    config.sockHost = socket.host;
    config.sockPath = socket.path;
    config.sockPort = socket.port;
  }

  return config;
}
