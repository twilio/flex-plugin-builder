"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJS = void 0;
var shortid_1 = __importDefault(require("./shortid"));
/**
 * Loads external JS files into your plugin.
 * Use this method at the beginning of the init() method of the plugin.
 * @param srcArray Array of JS file links to load
 * @return {void}
 */
var loadJS = function () {
    var srcArray = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        srcArray[_i] = arguments[_i];
    }
    srcArray.forEach(function (src) {
        var script = document.createElement('script');
        script.id = "external-js-" + shortid_1.default();
        script.type = 'text/javascript';
        script.src = src;
        document.body.appendChild(script);
    });
};
exports.loadJS = loadJS;
//# sourceMappingURL=loadJS.js.map