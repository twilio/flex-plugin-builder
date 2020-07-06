/// <reference path="../module.d.ts" />

import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import ModuleScopePlugin from '@k88/module-scope-plugin';
import typescriptFormatter from '@k88/typescript-compile-error-formatter';
import { semver } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { getDependencyVersion, getPaths } from 'flex-dev-utils/dist/fs';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  Loader,
  Plugin,
  Resolve,
  SourceMapDevToolPlugin,
} from 'webpack';
import { WebpackType } from './index';
import Optimization = webpack.Options.Optimization;

interface LoaderOption { [name: string]: any }

const IMAGE_SIZE_BYTE = 10 * 1024;
const FLEX_SHIM = 'flex-plugin-scripts/dev_assets/flex-shim.js';
const EXTERNALS = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
};

/**
 * Returns the JS scripts to inject into the index.html file
 * @param flexUIVersion   the flex-ui version
 * @param reactVersion    the react version
 * @param reactDOMVersion the react-dom version
 */
export const _getJSScripts = (flexUIVersion: string, reactVersion: string, reactDOMVersion: string): string[] => {
  if (!semver.satisfies(flexUIVersion, '>=1.19.0')) {
    return [
      `<script src="https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.min.js"></script>`,
    ];
  }

  return [
    `<script crossorigin src="https://unpkg.com/react@${reactVersion}/umd/react.development.js"></script>`,
    `<script crossorigin src="https://unpkg.com/react-dom@${reactDOMVersion}/umd/react-dom.development.js"></script>`,
    `<script src="https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.unbundled-react.min.js"></script>`,
  ];
};

/**
 * Returns the Babel Loader configuration
 * @param isProd  whether this is a production build
 */
const _getBabelLoader = (isProd: boolean) => ({
  test: new RegExp('\.(' + getPaths().extensions.join('|') + ')$'),
  include: getPaths().app.srcDir,
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
  /**
   * Gets the loader for the given style
   * @param options the options
   * @param preProcessor  the pre-processor, for example scss-loader
   * @param implementation  the implementation for thr scss-loader
   */
  const getStyleLoader = (options: LoaderOption, preProcessor?: string, implementation?: string) => {
    const loaders: Loader[] = [];

    // This is for hot-reloading to work
    if (!isProd) {
      loaders.push(require.resolve('style-loader'));
    }

    // All css loader
    loaders.push(
      {
        loader: require.resolve('css-loader'),
        options,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
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

    // Add a pre-processor loader (converting SCSS to CSS)
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
export const _getBasePlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];

  const flexUIVersion = getDependencyVersion('@twilio/flex-ui');
  const reactVersion = getDependencyVersion('react');
  const reactDOMVersion = getDependencyVersion('react-dom');

  plugins.push(new DefinePlugin({
    __FPB_PLUGIN_UNIQUE_NAME: `'${getPaths().app.name}'`,
    __FPB_PLUGIN_VERSION: `'${getPaths().app.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${flexUIVersion}'`,
    __FPB_REACT_VERSION: `'${reactVersion}'`,
    __FPB_REACT_DOM_VERSION: `'${reactDOMVersion}'`,
  }));

  return plugins;
};

/**
 * Returns an array of {@link Plugin} for Webpack Static
 * @param env
 */
export const _getStaticPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];

  const flexUIVersion = getDependencyVersion('@twilio/flex-ui');
  const reactVersion = getDependencyVersion('react');
  const reactDOMVersion = getDependencyVersion('react-dom');

  // index.html entry point
  if (env === Environment.Development) {
    plugins.push(new HotModuleReplacementPlugin());
    plugins.push(new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: getPaths().app.indexHtmlPath,
    }));
    plugins.push(new InterpolateHtmlPlugin({
      __FPB_JS_SCRIPTS: _getJSScripts(flexUIVersion, reactVersion, reactDOMVersion).join('\n'),
    }));
  }

  return plugins;
};

/**
 * Returns an array of {@link Plugin} for Webpack Javascript
 * @param env
 */
export const _getJSPlugins = (env: Environment): Plugin[] => {
  const plugins: Plugin[] = [];
  const isDev = env === Environment.Development;
  const isProd = env === Environment.Production;

  if (env === Environment.Production) {
    plugins.push(new SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=bundle.js.map',
    }));
  }
  const hasPnp = 'pnp' in process.versions;

  if (getPaths().app.isTSProject()) {
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
      tsconfig: getPaths().app.tsConfigPath,
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

  entry.push(getPaths().app.entryPath);

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
  const extensions = !getPaths().app.isTSProject()
    ? getPaths().extensions.filter(e => !e.includes('ts'))
    : getPaths().extensions;

  const resolve: Resolve = {
    modules: ['node_modules', getPaths().app.nodeModulesDir],
    extensions: extensions.map(e => `.${e}`),
    alias: {
      '@twilio/flex-ui': FLEX_SHIM,
    },
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(getPaths().app.srcDir, [getPaths().app.pkgPath]),
    ]
  };

  if (isProd && resolve.alias) {
    resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
  }

  return resolve;
};

/**
 * The base method for webpack
 * @param env
 */
export const _getBase = (env: Environment) => {
  const isProd = env === Environment.Production;
  const config: Configuration = {
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
    plugins: _getBasePlugins(env),
  };
  config.mode = isProd ? Environment.Production : Environment.Development;

  return config;
};

export const _getStaticConfiguration = (config: Configuration, env: Environment) => {
  config.plugins = config.plugins ? config.plugins : [];
  config.plugins.push(..._getStaticPlugins(env));

  return config;
}

export const _getJavaScriptConfiguration = (config: Configuration, env: Environment) => {
  const isProd = env === Environment.Production;

  config.plugins = config.plugins ? config.plugins : [];
  config.entry = _getEntries(env);
  config.output = {
    path: getPaths().app.buildDir,
    pathinfo: !isProd,
    futureEmitAssets: true,
    filename: `${getPaths().app.name}.js`,
    publicPath: getPaths().app.publicDir,
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
  config.plugins.push(..._getJSPlugins(env));

  return config;
}

/**
 * Main method for generating a webpack configuration
 * @param env
 * @param type
 */
export default (env: Environment, type: WebpackType) => {
  const config = _getBase(env);

  if (type === WebpackType.Static) {
    return _getStaticConfiguration(config, env);
  }
  if (type === WebpackType.JavaScript) {
    return _getJavaScriptConfiguration(config, env);
  }

  return _getJavaScriptConfiguration(_getStaticConfiguration(config, env), env);
};
