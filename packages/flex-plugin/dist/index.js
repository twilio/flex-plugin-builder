"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCSS = exports.loadJS = exports.getRuntimeUrl = exports.getAssetsUrl = exports.FlexPlugin = exports.loadPlugin = void 0;
/* eslint-disable import/no-unused-modules */
var flex_plugin_1 = require("./lib/flex-plugin");
Object.defineProperty(exports, "loadPlugin", { enumerable: true, get: function () { return flex_plugin_1.loadPlugin; } });
Object.defineProperty(exports, "FlexPlugin", { enumerable: true, get: function () { return flex_plugin_1.FlexPlugin; } });
var runtime_1 = require("./utils/runtime");
Object.defineProperty(exports, "getAssetsUrl", { enumerable: true, get: function () { return runtime_1.getAssetsUrl; } });
Object.defineProperty(exports, "getRuntimeUrl", { enumerable: true, get: function () { return runtime_1.getRuntimeUrl; } });
var loadJS_1 = require("./utils/loadJS");
Object.defineProperty(exports, "loadJS", { enumerable: true, get: function () { return loadJS_1.loadJS; } });
var loadCSS_1 = require("./utils/loadCSS");
Object.defineProperty(exports, "loadCSS", { enumerable: true, get: function () { return loadCSS_1.loadCSS; } });
//# sourceMappingURL=index.js.map