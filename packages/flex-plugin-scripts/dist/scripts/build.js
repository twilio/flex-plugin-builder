"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports._runWebpack = exports._handler = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var env_1 = require("@twilio/flex-dev-utils/dist/env");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var flex_plugin_webpack_1 = require("@twilio/flex-plugin-webpack");
var config_1 = __importStar(require("../config"));
var __1 = require("..");
var prints_1 = require("../prints");
var run_1 = __importDefault(require("../utils/run"));
var MAX_BUILD_SIZE_MB = 10;
/**
 * Builds the JS and Sourcemap bundles
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _handler = function (resolve, reject) {
    return function (err, stats) {
        if (err) {
            reject(err);
            return;
        }
        var result = stats.toJson({ all: false, warnings: true, errors: true });
        if (stats.hasErrors()) {
            reject(result.errors);
            return;
        }
        resolve({
            bundles: stats.toJson({ assets: true }).assets,
            warnings: result.warnings,
        });
    };
};
exports._handler = _handler;
/**
 * Promisify the webpack runner
 * @private
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
var _runWebpack = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, config_1.default(config_1.ConfigurationType.Webpack, env_1.Environment.Production, false)];
                        case 1:
                            config = _a.sent();
                            flex_plugin_webpack_1.webpack(config).run(exports._handler(resolve, reject));
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports._runWebpack = _runWebpack;
/**
 * Builds the bundle
 */
var build = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var index, _a, warnings, bundles, bundleSize, sourceMapSize, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    __1.setEnvironment.apply(void 0, __spreadArray([], __read(argv)));
                    flex_dev_utils_1.logger.debug('Building Flex plugin bundle');
                    index = argv.indexOf('--version');
                    if (index !== -1) {
                        fs_1.updateAppVersion(argv[index + 1]);
                    }
                    fs_1.addCWDNodeModule.apply(void 0, __spreadArray([], __read(argv)));
                    flex_dev_utils_1.env.setBabelEnv(env_1.Environment.Production);
                    flex_dev_utils_1.env.setNodeEnv(env_1.Environment.Production);
                    flex_dev_utils_1.logger.clearTerminal();
                    flex_dev_utils_1.logger.notice('Compiling a production build...');
                    flex_dev_utils_1.logger.newline();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports._runWebpack()];
                case 2:
                    _a = _b.sent(), warnings = _a.warnings, bundles = _a.bundles;
                    bundleSize = fs_1.getFileSizeInMB(fs_1.getPaths().app.bundlePath);
                    sourceMapSize = fs_1.getFileSizeInMB(fs_1.getPaths().app.sourceMapPath);
                    if (bundleSize >= MAX_BUILD_SIZE_MB) {
                        prints_1.fileTooLarge('bundle', bundleSize, MAX_BUILD_SIZE_MB);
                        flex_dev_utils_1.exit(1, argv);
                        return [2 /*return*/];
                    }
                    if (sourceMapSize >= MAX_BUILD_SIZE_MB) {
                        prints_1.fileTooLarge('sourcemap', bundleSize, MAX_BUILD_SIZE_MB);
                        flex_dev_utils_1.exit(1, argv);
                        return [2 /*return*/];
                    }
                    prints_1.buildSuccessful(bundles, warnings);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    prints_1.buildFailure(e_1);
                    flex_dev_utils_1.exit(1, argv);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(build);
// eslint-disable-next-line import/no-unused-modules
exports.default = build;
//# sourceMappingURL=build.js.map