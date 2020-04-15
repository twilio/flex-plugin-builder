import { env, paths } from 'flex-dev-utils';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';

/**
 * Generates a webpack-dev configuration
 */
export default () => {
  const { local } = getLocalAndNetworkUrls(env.getPort());
  const socket = env.getWSSocket();

  const config: Configuration = {
    compress: true,
    clientLogLevel: 'none',
    contentBase: [
      paths.app.publicDir,
      paths.scripts.devAssetsDir,
    ],
    publicPath: '/',
    contentBasePublicPath: '/',
    watchContentBase: true,
    hot: true,

    // We're using native sockjs-node
    transportMode: 'ws',
    sockHost: socket.host,
    sockPath: socket.path,
    sockPort: socket.port,

    // If path not found, load homepage, and let flex-ui handle the navigation
    historyApiFallback: {
      disableDotRule: true,
      index: '/',
    },

    // this is used to optimize cpu
    // watchOptions: {
    // //  ignored: ignoredFiles(paths.appSrc),
    // },

    quiet: true,
    injectClient: false,
    host: env.getHost(),
    port: env.getPort(),
    public: local.url,
  };

  return config;
}
