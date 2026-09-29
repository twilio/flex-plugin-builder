"use strict";
/* eslint-disable global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
/// <reference path="../module.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getJavaScriptConfiguration = exports._getStaticConfiguration = exports._getBase = exports._getResolve = exports._getOptimization = exports._getJavaScriptEntries = exports._getJSPlugins = exports._getStaticPlugins = exports._getBasePlugins = exports._getStyleLoaders = exports._getImageLoader = exports._getJSScripts = void 0;
var interpolate_html_plugin_1 = __importDefault(require("@k88/interpolate-html-plugin"));
var module_scope_plugin_1 = __importDefault(require("@k88/module-scope-plugin"));
var typescript_compile_error_formatter_1 = __importDefault(require("@k88/typescript-compile-error-formatter"));
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var env_1 = require("@twilio/flex-dev-utils/dist/env");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var pnp_webpack_plugin_1 = __importDefault(require("pnp-webpack-plugin"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var webpack_1 = require("webpack");
var clientVariables_1 = require("./clientVariables");
var __1 = require("..");
var IMAGE_SIZE_BYTE = 10 * 1024;
var FLEX_SHIM = '@twilio/flex-plugin-scripts/dev_assets/flex-shim.js';
var EXTERNALS = {
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
var _getJSScripts = function (flexUIVersion, reactVersion, reactDOMVersion) {
    var envSrc = flex_dev_utils_1.env.getFlexUISrc();
    if (!flex_dev_utils_1.semver.satisfies(flexUIVersion, '>=1.19.0')) {
        if (envSrc) {
            return ["<script src=\"" + envSrc + "\"></script>"];
        }
        return [
            "<script src=\"https://assets.flex.twilio.com/releases/flex-ui/" + flexUIVersion + "/twilio-flex.min.js\"></script>",
        ];
    }
    var flexUISrc = envSrc || "https://assets.flex.twilio.com/releases/flex-ui/" + flexUIVersion + "/twilio-flex.unbundled-react.min.js";
    return [
        "<script crossorigin src=\"https://unpkg.com/react@" + reactVersion + "/umd/react.development.js\"></script>",
        "<script crossorigin src=\"https://unpkg.com/react-dom@" + reactDOMVersion + "/umd/react-dom.development.js\"></script>",
        "<script src=\"" + flexUISrc + "\"></script>",
    ];
};
exports._getJSScripts = _getJSScripts;
/**
 * Returns the Babel Loader configuration
 * @param isProd  whether this is a production build
 */
/* c8 ignore next */
var _getBabelLoader = function (isProd) { return ({
    test: new RegExp(".(" + fs_1.getPaths().extensions.join('|') + ")$"),
    include: fs_1.getPaths().app.srcDir,
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
}); };
/**
 * Gets the image loader
 * @private
 */
/* c8 ignore next */
var _getImageLoader = function () { return ({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
        limit: IMAGE_SIZE_BYTE,
    },
}); };
exports._getImageLoader = _getImageLoader;
/**
 * Gets the styles loader
 * @param isProd  whether this is a production build
 * @private
 */
var _getStyleLoaders = function (isProd) {
    /**
     * Gets the loader for the given style
     * @param options the options
     * @param preProcessor  the pre-processor, for example scss-loader
     * @param implementation  the implementation for thr scss-loader
     */
    var getStyleLoader = function (options, preProcessor, implementation) {
        var loaders = [];
        // Main style loader to work when compiled
        loaders.push(require.resolve('style-loader'));
        // All css loader
        loaders.push({
            loader: require.resolve('css-loader'),
            options: options,
        }, {
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    plugins: function () { return [
                        require('postcss-flexbugs-fixes'),
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }),
                    ]; },
                },
                sourceMap: isProd,
            },
        });
        // Add a pre-processor loader (converting SCSS to CSS)
        if (preProcessor) {
            var preProcessorOptions = {
                sourceMap: isProd,
            };
            if (implementation) {
                var nodePath = fs_1.resolveModulePath(implementation);
                if (nodePath) {
                    preProcessorOptions.implementation = require(nodePath);
                }
            }
            loaders.push({
                loader: require.resolve('resolve-url-loader'),
                options: {
                    sourceMap: isProd,
                },
            }, {
                loader: require.resolve(preProcessor),
                options: preProcessorOptions,
            });
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
            use: getStyleLoader({
                importLoaders: 3,
                sourceMap: isProd,
            }, 'sass-loader', 'node-sass'),
            sideEffects: true,
        },
        {
            test: /\.module\.(scss|sass)$/,
            use: getStyleLoader({
                importLoaders: 3,
                sourceMap: isProd,
                modules: true,
            }, 'sass-loader', 'node-sass'),
        },
    ];
};
exports._getStyleLoaders = _getStyleLoaders;
/**
 * Returns an array of {@link Plugin} for Webpack
 * @param environment the environment
 * @private
 */
var _getBasePlugins = function (environment) {
    var plugins = [];
    var flexUIVersion = fs_1.getDependencyVersion('@twilio/flex-ui');
    var reactVersion = fs_1.getDependencyVersion('react');
    var reactDOMVersion = fs_1.getDependencyVersion('react-dom');
    var defined = {
        __FPB_PLUGIN_UNIQUE_NAME: "'" + fs_1.getPaths().app.name + "'",
        __FPB_PLUGIN_VERSION: "'" + fs_1.getPaths().app.version + "'",
        __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: "'" + fs_1.getDependencyVersion('@twilio/flex-plugin-scripts') + "'",
        __FPB_FLEX_PLUGIN_VERSION: "'" + fs_1.getDependencyVersion('@twilio/flex-plugin') + "'",
        __FPB_FLEX_UI_VERSION: "'" + flexUIVersion + "'",
        __FPB_REACT_VERSION: "'" + reactVersion + "'",
        __FPB_REACT_DOM_VERSION: "'" + reactDOMVersion + "'",
        // backward compatibility with v3
        __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION: "'N/A'",
    };
    // The @k88/cra-webpack-hot-dev-client package requires these environment variables to be replaced
    if (environment === env_1.Environment.Development) {
        if (flex_dev_utils_1.env.getWDSSocketHost()) {
            defined['process.env.WDS_SOCKET_HOST'] = flex_dev_utils_1.env.getWDSSocketHost();
        }
        if (flex_dev_utils_1.env.getWDSSocketPath()) {
            defined['process.env.WDS_SOCKET_PATH'] = flex_dev_utils_1.env.getWDSSocketPath();
        }
        if (flex_dev_utils_1.env.getWDSSocketPort()) {
            defined['process.env.WDS_SOCKET_PORT'] = flex_dev_utils_1.env.getWDSSocketPort();
        }
    }
    plugins.push(new webpack_1.DefinePlugin(__assign(__assign({}, defined), clientVariables_1.getSanitizedProcessEnv())));
    return plugins;
};
exports._getBasePlugins = _getBasePlugins;
/**
 * Returns an array of {@link Plugin} for Webpack Static
 * @param environment
 */
var _getStaticPlugins = function (environment) {
    var plugins = [];
    var dependencies = fs_1.getPaths().app.dependencies;
    // index.html entry point
    if (environment === env_1.Environment.Development) {
        plugins.push(new webpack_1.HotModuleReplacementPlugin());
        plugins.push(new html_webpack_plugin_1.default({
            inject: false,
            hash: false,
            template: fs_1.getPaths().scripts.indexHTMLPath,
        }));
        plugins.push(new interpolate_html_plugin_1.default({
            __FPB_JS_SCRIPTS: exports._getJSScripts(dependencies.flexUI.version, dependencies.react.version, dependencies.reactDom.version).join('\n'),
        }));
    }
    return plugins;
};
exports._getStaticPlugins = _getStaticPlugins;
/**
 * Returns an array of {@link Plugin} for Webpack Javascript
 * @param environment
 */
var _getJSPlugins = function (environment) {
    var plugins = [];
    var isDev = environment === env_1.Environment.Development;
    var isProd = environment === env_1.Environment.Production;
    if (isProd) {
        plugins.push(new webpack_1.SourceMapDevToolPlugin({
            append: '\n//# sourceMappingURL=bundle.js.map',
        }));
    }
    var hasPnp = 'pnp' in process.versions;
    if (fs_1.getPaths().app.isTSProject()) {
        var typescriptPath = fs_1.resolveModulePath('typescript');
        var config = {
            typescript: typescriptPath || undefined,
            async: isDev,
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            resolveModuleNameModule: hasPnp ? __dirname + "/webpack/pnpTs.js" : undefined,
            resolveTypeReferenceDirectiveModule: hasPnp ? __dirname + "/webpack/pnpTs.js" : undefined,
            tsconfig: fs_1.getPaths().app.tsConfigPath,
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
            config.formatter = typescript_compile_error_formatter_1.default;
        }
        plugins.push(new fork_ts_checker_webpack_plugin_1.default(config));
    }
    return plugins;
};
exports._getJSPlugins = _getJSPlugins;
/**
 * Returns the `entry` key of the webpack
 * @private
 */
var _getJavaScriptEntries = function () {
    var entry = [];
    entry.push(fs_1.getPaths().app.entryPath);
    return entry;
};
exports._getJavaScriptEntries = _getJavaScriptEntries;
/**
 * Returns the `optimization` key of webpack
 * @param environment the environment
 * @private
 */
/* c8 ignore next */
var _getOptimization = function (environment) {
    var isProd = environment === env_1.Environment.Production;
    return {
        splitChunks: false,
        runtimeChunk: false,
        minimize: isProd,
        minimizer: [
            new terser_webpack_plugin_1.default({
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
                },
                sourceMap: true,
            }),
        ],
    };
};
exports._getOptimization = _getOptimization;
/**
 * Returns the `resolve` key of webpack
 * @param environment the environment
 * @private
 */
var _getResolve = function (environment) {
    var isProd = environment === env_1.Environment.Production;
    var extensions = fs_1.getPaths().app.isTSProject()
        ? fs_1.getPaths().extensions
        : fs_1.getPaths().extensions.filter(function (e) { return !e.includes('ts'); });
    var paths = fs_1.getPaths();
    var resolve = {
        modules: [
            'node_modules',
            paths.app.nodeModulesDir,
            paths.scripts.nodeModulesDir,
            paths.webpack.nodeModulesDir,
            paths.cli.nodeModulesDir,
        ],
        extensions: extensions.map(function (e) { return "." + e; }),
        alias: {
            '@twilio/flex-ui': FLEX_SHIM,
        },
        plugins: [pnp_webpack_plugin_1.default, new module_scope_plugin_1.default(paths.app.srcDir, [paths.app.pkgPath])],
    };
    if (isProd && resolve.alias) {
        resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
    }
    return resolve;
};
exports._getResolve = _getResolve;
/**
 * Returns the base {@link Configuration}
 * @private
 */
var _getBase = function (environment) {
    var isProd = environment === env_1.Environment.Production;
    var config = {
        resolve: exports._getResolve(environment),
        resolveLoader: {
            plugins: [pnp_webpack_plugin_1.default.moduleLoader(module)],
        },
        externals: EXTERNALS,
        module: {
            strictExportPresence: true,
            rules: [
                { parser: { requireEnsure: false } },
                {
                    oneOf: __spreadArray([exports._getImageLoader(), _getBabelLoader(isProd)], __read(exports._getStyleLoaders(isProd))),
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                },
            ],
        },
        plugins: exports._getBasePlugins(environment),
    };
    config.mode = isProd ? env_1.Environment.Production : env_1.Environment.Development;
    config.entry = [];
    if (environment === env_1.Environment.Development) {
        config.entry.push(require.resolve('@k88/cra-webpack-hot-dev-client/build'));
    }
    return config;
};
exports._getBase = _getBase;
/**
 * Returns the {@link Configuration} for static type
 * @private
 */
var _getStaticConfiguration = function (config, environment) {
    var _a;
    config.plugins = config.plugins ? config.plugins : [];
    (_a = config.plugins).push.apply(_a, __spreadArray([], __read(exports._getStaticPlugins(environment))));
    return config;
};
exports._getStaticConfiguration = _getStaticConfiguration;
/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
var _getJavaScriptConfiguration = function (config, environment) {
    var _a, _b;
    var isProd = environment === env_1.Environment.Production;
    var filename = fs_1.getPaths().app.name + ".js";
    var outputName = environment === env_1.Environment.Production ? filename : "plugins/" + filename;
    config.entry = config.entry ? config.entry : [];
    config.plugins = config.plugins ? config.plugins : [];
    // @ts-ignore
    (_a = config.entry).push.apply(_a, __spreadArray([], __read(exports._getJavaScriptEntries())));
    config.output = {
        path: fs_1.getPaths().app.buildDir,
        pathinfo: !isProd,
        futureEmitAssets: true,
        filename: outputName,
        globalObject: 'this',
    };
    config.bail = isProd;
    config.devtool = isProd ? 'hidden-source-map' : 'source-map';
    config.optimization = exports._getOptimization(environment);
    config.node = {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        // eslint-disable-next-line camelcase
        child_process: 'empty',
    };
    (_b = config.plugins).push.apply(_b, __spreadArray([], __read(exports._getJSPlugins(environment))));
    return config;
};
exports._getJavaScriptConfiguration = _getJavaScriptConfiguration;
/**
 * Main method for generating a webpack configuration
 * @param environment
 * @param type
 */
exports.default = (function (environment, type) {
    var config = exports._getBase(environment);
    if (type === __1.WebpackType.Static) {
        return exports._getStaticConfiguration(config, environment);
    }
    if (type === __1.WebpackType.JavaScript) {
        return exports._getJavaScriptConfiguration(config, environment);
    }
    return exports._getJavaScriptConfiguration(exports._getStaticConfiguration(config, environment), environment);
});
//# sourceMappingURL=webpack.config.js.map