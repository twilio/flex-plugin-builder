"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getJavaScriptConfiguration = exports._getStaticConfiguration = exports._getBase = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var urls_1 = require("@twilio/flex-dev-utils/dist/urls");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
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
        static: {},
        client: {
            logging: 'none',
            webSocketURL: {
                hostname: local.host,
                pathname: local.url,
                port: flex_dev_utils_1.env.getPort(),
            },
        },
        host: flex_dev_utils_1.env.getHost(),
        port: flex_dev_utils_1.env.getPort(),
    };
};
exports._getBase = _getBase;
/**
 * Returns the {@link Configuration} for static type
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getStaticConfiguration = function (config) {
    config.historyApiFallback = {
        disableDotRule: true,
        index: '/',
    };
    config.static = [
        {
            directory: fs_1.getPaths().app.publicDir,
            publicPath: '/',
            watch: true,
        },
        {
            directory: fs_1.getPaths().scripts.devAssetsDir,
            publicPath: '/',
            watch: true,
        },
    ];
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
    config.static.serveIndex = true;
    // We're using native sockjs-node
    config.webSocketServer = 'ws';
    config.client.webSocketURL = {
        hostname: socket.host,
        pathname: socket.path,
        port: socket.port,
    };
    // Hot reload
    config.hot = false;
    return config;
};
exports._getJavaScriptConfiguration = _getJavaScriptConfiguration;
/**
 * Generates a webpack-dev configuration
 */
/* c8 ignore next */
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