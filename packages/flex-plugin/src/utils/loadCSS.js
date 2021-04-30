"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCSS = void 0;
var shortid_1 = __importDefault(require("./shortid"));
/**
 * Loads external CSS files into your plugin
 * Use this method at the beginning of the init() method of the plugin
 * @param hrefArray Array of CSS file links to load
 * @return {void}
 */
var loadCSS = function () {
    var hrefArray = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        hrefArray[_i] = arguments[_i];
    }
    hrefArray.forEach(function (href) {
        var link = document.createElement('link');
        link.id = "external-css-" + shortid_1.default();
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'all';
        link.href = href;
        document.head.appendChild(link);
    });
};
exports.loadCSS = loadCSS;
//# sourceMappingURL=loadCSS.js.map