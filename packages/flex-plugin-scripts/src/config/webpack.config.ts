import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import ModuleScopePlugin from '@k88/module-scope-plugin';
import { Environment } from 'flex-dev-utils/dist/env';
import { getDependencyVersion } from 'flex-dev-utils/dist/fs';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin, Loader,
  Plugin,
  Resolve,
  SourceMapDevToolPlugin,
} from 'webpack';

import paths from '../utils/paths';
import Optimization = webpack.Options.Optimization;

interface LoaderOption { [name: string]: any };

const IMAGE_SIZE_BYTE = 10 * 1024;
const FLEX_SHIM = 'flex-plugin-scripts/dev_assets/flex-shim.js';
const EXTERNALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
};

/**
 * Returns the Babel Loader configuration
 * @param isProd  whether this is a production build
 */
const _getBabelLoader = (isProd: boolean) => ({
  test: new RegExp('\.(' + paths.extensions.join('|') + ')$'),
  include: paths.srcDir,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    babelrc: false,
    configFile: false,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: { ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]' },
          },
        },
      ],
    ],
    compact: isProd,
  },
});

/**
 * Gets the image loader
 * @private
 */
export const _getImageLoader = () => ({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: IMAGE_SIZE_BYTE,
    },
});

/**
 * Gets the styles loader
 * @param isProd  whether this is a production build
 * @private
 */
export const _getStyleLoaders = (isProd: boolean) => {
  const getStyleLoader = (options: LoaderOption, preProcessor?: string, implementation?: string) => {
    const loaders: Loader[] = [];
    if (!isProd) {
      loaders.push(require.resolve('style-loader'));
    }
    loaders.push(
      {
        loader: require.resolve('css-loader'),
        options: options,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: isProd,
        },
      }
    );

    if (preProcessor) {
      const preProcessorOptions: Record<string, any> = {
        sourceMap: isProd,
      };

      if (implementation) {
        const nodePath = resolveModulePath(implementation);
        if (nodePath) {
          preProcessorOptions.implementation = require(nodePath);
        }
      }

      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isProd,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: preProcessorOptions,
        }
      );
    }

    return loaders;
  };

  return [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: getStyleLoader( {
        importLoaders: 1,
        sourceMap: isProd,
      }),
      sideEffects: true,
    },
    {
      test: /\.module\.css$/,
      use: getStyleLoader({
        importLoaders: 1,
        sourceMap: isProd,
        modules: true
      }),
    },
    {
      test: /\.(scss|sass)$/,
      exclude: /\.module\.(scss|sass)$/,
      use: getStyleLoader(
        {
          importLoaders: 3,
          sourceMap: isProd,
        },
        'sass-loader',
        'node-sass',
      ),
      sideEffects: true,
    },
    {
      test: /\.module\.(scss|sass)$/,
      use: getStyleLoader(
        {
          importLoaders: 3,
          sourceMap: isProd,
          modules: true,
        },
        'sass-loader',
        'node-sass',
      ),
    },
  ];
};

/**
 * Returns an array of {@link Plugin} for Webpack
 * @param env the environment
 * @private
 */
export const _getPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];

  plugins.push(new DefinePlugin({
    __FPB_PLUGIN_UNIQUE_NAME: `'${paths.packageName}'`,
    __FPB_PLUGIN_VERSION: `'${paths.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${getDependencyVersion('@twilio/flex-ui')}'`,
    __FPB_REACT_VERSION: `'${getDependencyVersion('react')}'`,
    __FPB_REACT_DOM_VERSION: `'${getDependencyVersion('react-dom')}'`,
  }));

  if (env === Environment.Production) {
    plugins.push(new SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=bundle.js.map',
    }));
  }

  if (env === Environment.Development) {
    plugins.push(new HotModuleReplacementPlugin());

    const pkg = require(paths.flexUIPkgPath);
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: paths.indexHtmlPath,
    }));
    plugins.push(new InterpolateHtmlPlugin({
      TWILIO_FLEX_VERSION: pkg.version,
    }));
  }

  return plugins;
};

/**
 * Returns the `entry` key of the webpack
 * @param env the environment
 * @private
 */
export const _getEntries = (env: Environment): string[] => {
  const entry: string[] = [];

  if (env === Environment.Development) {
    entry.push(
      require.resolve('@k88/cra-webpack-hot-dev-client/build'),
    );
  }

  entry.push(paths.entryPath);

  return entry;
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
 * Returns the `resolve` key of webpack
 * @param env the environment
 * @private
 */
export const _getResolve = (env: Environment): Resolve => {
  const isProd = env === Environment.Production;

  const resolve: Resolve = {
    modules: ['node_modules', paths.nodeModulesDir],
    extensions: paths.extensions.map(e => `.${e}`),
    alias: {
      '@twilio/flex-ui': FLEX_SHIM,
    },
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(paths.srcDir, [paths.packageJsonPath]),
    ]
  };

  if (isProd && resolve.alias) {
    resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
  }

  return resolve;
};

/**
 * Main method for generating a webpack configuration
 * @param env
 */
export default (env: Environment) => {
  const isProd = env === Environment.Production;

  const config: Configuration = {
    entry: _getEntries(env),
    output: {
      path: paths.buildDir,
      pathinfo: !isProd,
      futureEmitAssets: true,
      filename: `${paths.packageName}.js`,
      publicPath: paths.publicDir,
      globalObject: 'this',
    },
    bail: isProd,
    devtool: 'hidden-source-map',
    optimization: _getOptimization(env),
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    resolve: _getResolve(env),
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ]
    },
    externals: EXTERNALS,
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            _getImageLoader(),
            _getBabelLoader(isProd),
            ..._getStyleLoaders(isProd),
          ]
        },
      ]
    },
    plugins: _getPlugins(env),
  };
  config.mode = isProd ? Environment.Production : Environment.Development;

  return config;
};
