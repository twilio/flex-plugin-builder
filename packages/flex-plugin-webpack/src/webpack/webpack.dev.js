"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getJavaScriptConfiguration = exports._getStaticConfiguration = exports._getBase = void 0;
var flex_dev_utils_1 = require("flex-dev-utils");
var urls_1 = require("flex-dev-utils/dist/urls");
var fs_1 = require("flex-dev-utils/dist/fs");
var __1 = require("..");
/**
 * Returns the base {@link Configuration}
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getBase = function () {
    var local = urls_1.getLocalAndNetworkUrls(flex_dev_utils_1.env.getPort()).local;
    return {
        compress: true,
        clientLogLevel: 'none',
        quiet: true,
        host: flex_dev_utils_1.env.getHost(),
        port: flex_dev_utils_1.env.getPort(),
        public: local.url,
    };
};
exports._getBase = _getBase;
/**
 * Returns the {@link Configuration} for static type
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getStaticConfiguration = function (config) {
    config.contentBase = [fs_1.getPaths().app.publicDir, fs_1.getPaths().scripts.devAssetsDir];
    config.contentBasePublicPath = '/';
    config.historyApiFallback = {
        disableDotRule: true,
        index: '/',
    };
    config.publicPath = '/';
    config.watchContentBase = true;
    return config;
};
exports._getStaticConfiguration = _getStaticConfiguration;
/**
 * Returns the {@link Configuration} for JS type
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getJavaScriptConfiguration = function (config) {
    var socket = flex_dev_utils_1.env.getWSSocket();
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
};
exports._getJavaScriptConfiguration = _getJavaScriptConfiguration;
/**
 * Generates a webpack-dev configuration
 */
/* istanbul ignore next */
exports.default = (function (type) {
    var config = exports._getBase();
    if (type === __1.WebpackType.Static) {
        return exports._getStaticConfiguration(config);
    }
    if (type === __1.WebpackType.JavaScript) {
        return exports._getJavaScriptConfiguration(config);
    }
    return exports._getJavaScriptConfiguration(exports._getStaticConfiguration(config));
});
//# sourceMappingURL=webpack.dev.js.map