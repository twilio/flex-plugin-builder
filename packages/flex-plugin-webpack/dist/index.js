"use strict";
/* eslint-disable import/no-unused-modules */
/* c8 ignore start */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayRenderStaticPlugin = exports.startIPCServer = exports.startIPCClient = exports.onIPCServerMessage = exports.IPCType = exports.emitAllCompilesComplete = exports.emitDevServerCrashed = exports.emitCompileComplete = exports.PLUGIN_INPUT_PARSER_REGEX = exports.pluginServer = exports.webpackDevServer = exports.compilerRenderer = exports.compiler = exports.webpackDevFactory = exports.webpackFactory = exports.WebpackCompiler = exports.webpack = exports.WebpackType = void 0;
var webpack_1 = __importDefault(require("webpack"));
exports.webpack = webpack_1.default;
var WebpackType;
(function (WebpackType) {
    WebpackType["Static"] = "static";
    WebpackType["JavaScript"] = "javascript";
    WebpackType["Complete"] = "complete";
})(WebpackType = exports.WebpackType || (exports.WebpackType = {}));
var webpack_2 = require("webpack");
Object.defineProperty(exports, "WebpackCompiler", { enumerable: true, get: function () { return webpack_2.Compiler; } });
var webpack_config_1 = require("./webpack/webpack.config");
Object.defineProperty(exports, "webpackFactory", { enumerable: true, get: function () { return __importDefault(webpack_config_1).default; } });
var webpack_dev_1 = require("./webpack/webpack.dev");
Object.defineProperty(exports, "webpackDevFactory", { enumerable: true, get: function () { return __importDefault(webpack_dev_1).default; } });
var compiler_1 = require("./compiler");
Object.defineProperty(exports, "compiler", { enumerable: true, get: function () { return __importDefault(compiler_1).default; } });
Object.defineProperty(exports, "compilerRenderer", { enumerable: true, get: function () { return compiler_1.compilerRenderer; } });
var webpackDevServer_1 = require("./devServer/webpackDevServer");
Object.defineProperty(exports, "webpackDevServer", { enumerable: true, get: function () { return __importDefault(webpackDevServer_1).default; } });
var pluginServer_1 = require("./devServer/pluginServer");
Object.defineProperty(exports, "pluginServer", { enumerable: true, get: function () { return __importDefault(pluginServer_1).default; } });
Object.defineProperty(exports, "PLUGIN_INPUT_PARSER_REGEX", { enumerable: true, get: function () { return pluginServer_1.PLUGIN_INPUT_PARSER_REGEX; } });
var ipcServer_1 = require("./devServer/ipcServer");
Object.defineProperty(exports, "emitCompileComplete", { enumerable: true, get: function () { return ipcServer_1.emitCompileComplete; } });
Object.defineProperty(exports, "emitDevServerCrashed", { enumerable: true, get: function () { return ipcServer_1.emitDevServerCrashed; } });
Object.defineProperty(exports, "emitAllCompilesComplete", { enumerable: true, get: function () { return ipcServer_1.emitAllCompilesComplete; } });
Object.defineProperty(exports, "IPCType", { enumerable: true, get: function () { return ipcServer_1.IPCType; } });
Object.defineProperty(exports, "onIPCServerMessage", { enumerable: true, get: function () { return ipcServer_1.onIPCServerMessage; } });
Object.defineProperty(exports, "startIPCClient", { enumerable: true, get: function () { return ipcServer_1.startIPCClient; } });
Object.defineProperty(exports, "startIPCServer", { enumerable: true, get: function () { return ipcServer_1.startIPCServer; } });
var DelayRenderStaticPlugin_1 = require("./plugins/DelayRenderStaticPlugin");
Object.defineProperty(exports, "DelayRenderStaticPlugin", { enumerable: true, get: function () { return __importDefault(DelayRenderStaticPlugin_1).default; } });
/* c8 ignore stop */
//# sourceMappingURL=index.js.map