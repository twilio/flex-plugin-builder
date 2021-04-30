"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationType = exports.WebpackType = void 0;
/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports */
var env_1 = require("flex-dev-utils/dist/env");
var errors_1 = require("flex-dev-utils/dist/errors");
var fs_1 = require("flex-dev-utils/dist/fs");
var flex_plugin_webpack_1 = require("flex-plugin-webpack");
Object.defineProperty(exports, "WebpackType", { enumerable: true, get: function () { return flex_plugin_webpack_1.WebpackType; } });
var jest_config_1 = __importDefault(require("./jest.config"));
var ConfigurationType;
(function (ConfigurationType) {
    ConfigurationType["Webpack"] = "webpack";
    ConfigurationType["DevServer"] = "devServer";
    ConfigurationType["Jest"] = "jest";
})(ConfigurationType = exports.ConfigurationType || (exports.ConfigurationType = {}));
/**
 * Returns the configuration; if customer has provided a webpack.config.js, then the generated
 * config is passed to their Function for modification
 * @param name  the configuration name
 * @param env   the environment
 * @param type  the webpack type
 */
var getConfiguration = function (name, env, type) {
    if (type === void 0) { type = flex_plugin_webpack_1.WebpackType.Complete; }
    return __awaiter(void 0, void 0, void 0, function () {
        var args, config, exception_1, config, exception_2, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = {
                        isProd: env === env_1.Environment.Production,
                        isDev: env === env_1.Environment.Development,
                        isTest: env === env_1.Environment.Test,
                    };
                    if (!(name === ConfigurationType.Webpack)) return [3 /*break*/, 5];
                    config = flex_plugin_webpack_1.webpackFactory(env, type);
                    if (type === flex_plugin_webpack_1.WebpackType.Static) {
                        return [2 /*return*/, config];
                    }
                    if (!fs_1.checkFilesExist(fs_1.getPaths().app.webpackConfigPath)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 2, , 4]);
                    return [2 /*return*/, require(fs_1.getPaths().app.webpackConfigPath)(config, args)];
                case 2:
                    exception_1 = _a.sent();
                    return [4 /*yield*/, flex_plugin_webpack_1.emitDevServerCrashed(exception_1)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, config];
                case 5:
                    if (!(name === ConfigurationType.DevServer)) return [3 /*break*/, 10];
                    config = flex_plugin_webpack_1.webpackDevFactory(type);
                    if (type === flex_plugin_webpack_1.WebpackType.Static) {
                        return [2 /*return*/, config];
                    }
                    if (!fs_1.checkFilesExist(fs_1.getPaths().app.devServerConfigPath)) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 7, , 9]);
                    return [2 /*return*/, require(fs_1.getPaths().app.devServerConfigPath)(config, args)];
                case 7:
                    exception_2 = _a.sent();
                    return [4 /*yield*/, flex_plugin_webpack_1.emitDevServerCrashed(exception_2)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, config];
                case 10:
                    if (name === ConfigurationType.Jest) {
                        config = jest_config_1.default();
                        if (fs_1.checkFilesExist(fs_1.getPaths().app.jestConfigPath)) {
                            return [2 /*return*/, require(fs_1.getPaths().app.jestConfigPath)(config, args)];
                        }
                        return [2 /*return*/, config];
                    }
                    throw new errors_1.FlexPluginError('Unsupported configuration name');
            }
        });
    });
};
exports.default = getConfiguration;
//# sourceMappingURL=index.js.map