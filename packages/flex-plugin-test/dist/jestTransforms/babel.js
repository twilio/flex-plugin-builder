"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* c8 ignore start */
var babel_jest_1 = __importDefault(require("babel-jest"));
module.exports = babel_jest_1.default.createTransformer({
    presets: [require.resolve('babel-preset-react-app')],
    babelrc: false,
    configFile: false,
});
/* c8 ignore stop */
//# sourceMappingURL=babel.js.map