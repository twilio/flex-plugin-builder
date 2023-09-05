/* eslint-disable global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
/// <reference path="../module.d.ts" />

import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import ModuleScopePlugin from '@k88/module-scope-plugin';
import typescriptFormatter from '@k88/typescript-compile-error-formatter';
import { semver, env } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { getDependencyVersion, getPaths, resolveModulePath } from '@twilio/flex-dev-utils/dist/fs';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
  RuleSetRule,
  WebpackPluginInstance,
  SourceMapDevToolPlugin,
  ResolveOptions,
} from 'webpack';

import { getSanitizedProcessEnv } from './clientVariables';
import { WebpackType } from '..';

interface LoaderOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
}

const IMAGE_SIZE_BYTE = 10 * 1024;
const FLEX_SHIM = '@twilio/flex-plugin-scripts/dev_assets/flex-shim.js';
const EXTERNALS = {
  react: 'React',
  'react-dom': 'ReactDOM',
  redux: 'Redux',
  'react-redux': 'ReactRedux',
};

/**
 * Returns the JS scripts to inject into the index.html file
 * @param flexUIVersion   the flex-ui version
 * @param reactVersion    the react version
 * @param reactDOMVersion the react-dom version
 */
export const _getJSScripts = (flexUIVersion: string, reactVersion: string, reactDOMVersion: string): string[] => {
  const envSrc = env.getFlexUISrc();
  if (!semver.satisfies(flexUIVersion, '>=1.19.0')) {
    if (envSrc) {
      return [`<script src="${envSrc}"></script>`];
    }

    return [
      `<script src="https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.min.js"></script>`,
    ];
  }

  const flexUISrc =
    envSrc || `https://assets.flex.twilio.com/releases/flex-ui/${flexUIVersion}/twilio-flex.unbundled-react.min.js`;

  return [
    `<script crossorigin src="https://unpkg.com/react@${reactVersion}/umd/react.development.js"></script>`,
    `<script crossorigin src="https://unpkg.com/react-dom@${reactDOMVersion}/umd/react-dom.development.js"></script>`,
    `<script src="${flexUISrc}"></script>`,
  ];
};

/**
 * Returns the Babel Loader configuration
 * @param isProd  whether this is a production build
 */
/* c8 ignore next */
const _getBabelLoader = (isProd: boolean) => ({
  test: new RegExp(`\.(${getPaths().extensions.join('|')})$`),
  include: getPaths().app.srcDir,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    babelrc: false,
    configFile: false,
    presets: [
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-typescript'),
    ],
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
/* c8 ignore next */
const _getImageLoader = (): RuleSetRule => ({
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
const _getStyleLoaders = (isProd: boolean): RuleSetRule[] => {
  /**
   * Gets the loader for the given style
   * @param options the options
   * @param preProcessor  the pre-processor, for example scss-loader
   * @param implementation  the implementation for thr scss-loader
   */
  const getStyleLoader = (options: LoaderOption, preProcessor?: string, implementation?: string) => {
    const loaders = [];

    // Main style loader to work when compiled
    loaders.push(require.resolve('style-loader'));

    // All css loader
    loaders.push(
      {
        loader: require.resolve('css-loader'),
        options,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
          },
          sourceMap: isProd,
        },
      },
    );

    // Add a pre-processor loader (converting SCSS to CSS)
    if (preProcessor) {
      const preProcessorOptions: Record<string, unknown> = {
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
        },
      );
    }

    return loaders;
  };

  return [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: getStyleLoader({
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
        modules: true,
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
 * @param environment the environment
 * @private
 */
const _getBasePlugins = (environment: Environment) => {
  const plugins: WebpackPluginInstance[] = [];

  const flexUIVersion = getDependencyVersion('@twilio/flex-ui');
  const reactVersion = getDependencyVersion('react');
  const reactDOMVersion = getDependencyVersion('react-dom');

  const defined = {
    __FPB_PLUGIN_UNIQUE_NAME: `'${getPaths().app.name}'`,
    __FPB_PLUGIN_VERSION: `'${getPaths().app.version}'`,
    __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${getDependencyVersion('@twilio/flex-plugin-scripts')}'`,
    __FPB_FLEX_PLUGIN_VERSION: `'${getDependencyVersion('@twilio/flex-plugin')}'`,
    __FPB_FLEX_UI_VERSION: `'${flexUIVersion}'`,
    __FPB_REACT_VERSION: `'${reactVersion}'`,
    __FPB_REACT_DOM_VERSION: `'${reactDOMVersion}'`,
    // backward compatibility with v3
    __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION: `'N/A'`,
  };

  // The @k88/cra-webpack-hot-dev-client package requires these environment variables to be replaced
  if (environment === Environment.Development) {
    if (env.getWDSSocketHost()) {
      defined['process.env.WDS_SOCKET_HOST'] = env.getWDSSocketHost();
    }
    if (env.getWDSSocketPath()) {
      defined['process.env.WDS_SOCKET_PATH'] = env.getWDSSocketPath();
    }
    if (env.getWDSSocketPort()) {
      defined['process.env.WDS_SOCKET_PORT'] = env.getWDSSocketPort();
    }
  }

  plugins.push(new DefinePlugin({ ...defined, ...getSanitizedProcessEnv() }));

  return plugins;
};

/**
 * Returns an array of {@link Plugin} for Webpack Static
 * @param environment
 */
const _getStaticPlugins = (environment: Environment) => {
  const plugins: WebpackPluginInstance[] = [];
  const { dependencies } = getPaths().app;

  // index.html entry point
  if (environment === Environment.Development) {
    plugins.push(new HotModuleReplacementPlugin());
    plugins.push(
      new HtmlWebpackPlugin({
        inject: false,
        template: getPaths().scripts.indexHTMLPath,
        templateParameters: {
          __FPB_JS_SCRIPTS: _getJSScripts(
            dependencies.flexUI.version,
            dependencies.react.version,
            dependencies.reactDom.version,
          ).join('\n'),
        },
      }),
    );
    /*
     * plugins.push(
     *   new InterpolateHtmlPlugin({
     *     __FPB_JS_SCRIPTS: _getJSScripts(
     *       dependencies.flexUI.version,
     *       dependencies.react.version,
     *       dependencies.reactDom.version,
     *     ).join('\n'),
     *   }),
     * );
     */
  }

  return plugins;
};

/**
 * Returns an array of {@link Plugin} for Webpack Javascript
 * @param environment
 */
const _getJSPlugins = (environment: Environment) => {
  const plugins = [];
  const isDev = environment === Environment.Development;
  const isProd = environment === Environment.Production;

  if (isProd) {
    plugins.push(
      new SourceMapDevToolPlugin({
        filename: `${getPaths().app.name}.js.map`,
        module: false,
        append: '\n//# sourceMappingURL=bundle.js.map',
      }),
    );
  }
  const hasPnp = 'pnp' in process.versions;

  if (getPaths().app.isTSProject()) {
    const typescriptPath = resolveModulePath('typescript');
    const config: Partial<ForkTsCheckerWebpackPlugin.Options> = {
      typescript: typescriptPath || undefined,
      async: isDev,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      resolveModuleNameModule: hasPnp ? `${__dirname}/webpack/pnpTs.js` : undefined,
      resolveTypeReferenceDirectiveModule: hasPnp ? `${__dirname}/webpack/pnpTs.js` : undefined,
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
      config.formatter = typescriptFormatter;
    }

    plugins.push(new ForkTsCheckerWebpackPlugin(config));
  }

  return plugins;
};

/**
 * Returns the `entry` key of the webpack
 * @private
 */
const _getJavaScriptEntries = (): string[] => {
  const entry: string[] = [];
  entry.push(getPaths().app.entryPath);

  return entry;
};

/**
 * Returns the `optimization` key of webpack
 * @param environment the environment
 * @private
 */
/* c8 ignore next */
const _getOptimization = (environment: Environment) => {
  const isProd = environment === Environment.Production;
  return {
    splitChunks: false as unknown as false,
    runtimeChunk: false,
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 5,
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // eslint-disable-next-line camelcase
          keep_classnames: isProd,
          // eslint-disable-next-line camelcase
          keep_fnames: isProd,
          output: {
            ecma: 5,
            comments: false,
            // eslint-disable-next-line camelcase
            ascii_only: true,
          },
          sourceMap: true,
        },
      }),
    ],
  };
};

/**
 * Returns the `resolve` key of webpack
 * @param environment the environment
 * @private
 */
const _getResolve = (environment: Environment) => {
  const isProd = environment === Environment.Production;
  const extensions = getPaths().app.isTSProject()
    ? getPaths().extensions
    : getPaths().extensions.filter((e) => !e.includes('ts'));

  const paths = getPaths();

  const resolve: ResolveOptions = {
    modules: [
      'node_modules',
      paths.app.nodeModulesDir,
      paths.scripts.nodeModulesDir,
      paths.webpack.nodeModulesDir,
      paths.cli.nodeModulesDir,
    ],
    extensions: extensions.map((e) => `.${e}`),
    alias: {
      '@twilio/flex-ui': FLEX_SHIM,
    },
    plugins: [PnpWebpackPlugin, new ModuleScopePlugin(paths.app.srcDir, [paths.app.pkgPath])],
  };

  if (isProd && resolve.alias) {
    resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
  }

  return resolve;
};

/**
 * Returns the base {@link Configuration}
 * @private
 */
const _getBase = (environment: Environment): Configuration => {
  const isProd = environment === Environment.Production;
  const config: Configuration = {
    resolve: _getResolve(environment),
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    externals: EXTERNALS,
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [_getImageLoader(), _getBabelLoader(isProd), ..._getStyleLoaders(isProd)],
        },
      ],
    },
    plugins: _getBasePlugins(environment),
  };
  config.mode = isProd ? Environment.Production : Environment.Development;

  config.entry = [];
  if (environment === Environment.Development) {
    config.entry.push(require.resolve('@k88/cra-webpack-hot-dev-client/build'));
  }

  return config;
};

/**
 * Returns the {@link Configuration} for static type
 * @private
 */
const _getStaticConfiguration = (config: Configuration, environment: Environment): Configuration => {
  config.plugins = config.plugins ? config.plugins : [];
  config.plugins.push(..._getStaticPlugins(environment));

  return config;
};

/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
const _getJavaScriptConfiguration = (config: Configuration, environment: Environment): Configuration => {
  const isProd = environment === Environment.Production;
  const filename = `${getPaths().app.name}`;
  const outputName = environment === Environment.Production ? filename : `plugins/${filename}`;

  config.entry = config.entry ? config.entry : [];
  config.plugins = config.plugins ? config.plugins : [];

  // @ts-ignore
  config.entry.push(..._getJavaScriptEntries());
  config.output = {
    path: getPaths().app.buildDir,
    pathinfo: !isProd,
    filename: `${outputName}.js`,
    sourceMapFilename: `${outputName}.[contenthash].js.map`,
    publicPath: '/',
    globalObject: 'this',
  };
  config.bail = isProd;
  config.devtool = isProd ? 'cheap-source-map' : 'source-map';
  config.optimization = _getOptimization(environment);
  config.node = false;
  config.plugins.push(..._getJSPlugins(environment));

  return config;
};

/**
 * Main method for generating a webpack configuration
 * @param environment
 * @param type
 */
export default (environment: Environment, type: WebpackType): Configuration => {
  const config = _getBase(environment);

  console.log('webpack.config', type)
  if (type === WebpackType.Static) {
    return _getStaticConfiguration(config, environment);
  }
  if (type === WebpackType.JavaScript) {
    return _getJavaScriptConfiguration(config, environment);
  }

  return _getJavaScriptConfiguration(_getStaticConfiguration(config, environment), environment);
};
