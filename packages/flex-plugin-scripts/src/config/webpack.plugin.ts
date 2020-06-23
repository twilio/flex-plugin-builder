import webpackBaseFactory from './webpack.base';
import { paths } from 'flex-dev-utils';
import typescriptFormatter from '@k88/typescript-compile-error-formatter';
import { Environment } from 'flex-dev-utils/dist/env';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Plugin,
  SourceMapDevToolPlugin,
} from 'webpack';

import Optimization = webpack.Options.Optimization;

/**
 * Returns an array of {@link Plugin} for Webpack
 * @param env the environment
 * @private
 */
export const _getPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];
  const isDev = env === Environment.Development;
  const isProd = env === Environment.Production;

  if (env === Environment.Production) {
    plugins.push(new SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=bundle.js.map',
    }));
  }
  const hasPnp = 'pnp' in process.versions;

  if (paths.app.isTSProject()) {
    const typescriptPath = resolveModulePath('typescript');
    const config: Partial<ForkTsCheckerWebpackPlugin.Options> = {
      typescript: typescriptPath || undefined,
      async: isDev,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      resolveModuleNameModule: hasPnp
        ? `${__dirname}/webpack/pnpTs.js`
        : undefined,
      resolveTypeReferenceDirectiveModule: hasPnp
        ? `${__dirname}/webpack/pnpTs.js`
        : undefined,
      tsconfig: paths.app.tsConfigPath,
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/__mocks__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      silent: true,
    };
    if (isProd) {
      config.formatter = typescriptFormatter
    }

    plugins.push(new ForkTsCheckerWebpackPlugin(config));
  }

  return plugins;
};

/**
 * Returns the `optimization` key of webpack
 * @param env the environment
 * @private
 */
export const _getOptimization = (env: Environment): Optimization => {
  const isProd = env === Environment.Production;
  return {
    splitChunks: false,
    runtimeChunk: false,
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: isProd,
          keep_fnames: isProd,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: true,
      }),
    ],
  };
};

/**
 * Returns the `entry` key of the webpack
 * @param env the environment
 * @private
 */
export const _getEntries = (env: Environment): string[] => {
  // this is specifically only for the javascirpt bundle
  const entry: string[] = [];

  if (env === Environment.Development) {
    entry.push(
      require.resolve('@k88/cra-webpack-hot-dev-client/build'),
    );
  }

  entry.push(paths.app.entryPath);

  return entry;
};

/**
 * Main method for generating a webpack configuration
 * @param env
 */
export default (env: Environment) => {
  const isProd = env === Environment.Production;
  const config = webpackBaseFactory(env);

  config.entry = _getEntries(env);
  config.output = {
    path: paths.app.buildDir,
    pathinfo: !isProd,
    futureEmitAssets: true,
    filename: `${paths.app.name}.js`,
    publicPath: paths.app.publicDir,
    globalObject: 'this',
  };
  config.bail = isProd;
  config.devtool = 'hidden-source-map';
  config.optimization = _getOptimization(env);
  config.node = {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  };
  config.plugins = config.plugins ? config.plugins : [];
  config.plugins.push(..._getPlugins(env));

  return config;
};