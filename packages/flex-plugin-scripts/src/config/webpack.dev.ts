import { env } from 'flex-dev-utils';
import { getUrls } from 'flex-dev-utils/dist/urls';
import { Configuration } from 'webpack-dev-server';

import paths from '../utils/paths';

export default () => {
  const { local } = getUrls(env.getPort());
  const sockHost = process.env.WDS_SOCKET_HOST;
  const sockPath = process.env.WDS_SOCKET_PATH;
  const sockPort = process.env.WDS_SOCKET_PORT;

  const config: Configuration = {
    compress: true,
    clientLogLevel: 'none',
    contentBase: [
      paths.appPublicDir,
      paths.devAssetsDir,
    ],
    publicPath: '/',
    contentBasePublicPath: '/',
    watchContentBase: true,
    hot: true,

    // We're using native sockjs-node
    transportMode: 'ws',
    sockHost,
    sockPath,
    sockPort,

    // If path not found, load homepage, and let flex-ui handle the navigation
    historyApiFallback: {
      disableDotRule: true,
      index: '/',
    },

    //
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
