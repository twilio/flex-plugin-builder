import { Configuration } from 'webpack-dev-server';

import paths from '../utils/paths';

export default () => {
  const config: Configuration = {
    compress: true,
    clientLogLevel: 'none',
    contentBase: [
      paths.appPublicDir,
      paths.devAssetsDir,
    ],
    watchContentBase: true,
    hot: true,
    quiet: true,
    injectClient: false,
    host: process.env.HOST,
    port: Number(process.env.PORT),
  };

  return config;
}
