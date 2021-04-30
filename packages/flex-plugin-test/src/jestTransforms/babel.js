"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
var babel_jest_1 = __importDefault(require("babel-jest"));
module.exports = babel_jest_1.default.createTransformer({
    presets: [require.resolve('babel-preset-react-app')],
    babelrc: false,
    configFile: false,
});
//# sourceMappingURL=babel.js.map