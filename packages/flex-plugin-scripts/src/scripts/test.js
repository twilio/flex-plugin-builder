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
exports._parseArgs = exports._validateJest = exports.DEFAULT_JEST_ENV = void 0;
var flex_dev_utils_1 = require("flex-dev-utils");
var env_1 = require("flex-dev-utils/dist/env");
var fs_1 = require("flex-dev-utils/dist/fs");
var prints_1 = require("../prints");
var run_1 = __importDefault(require("../utils/run"));
exports.DEFAULT_JEST_ENV = 'jsdom';
/**
 * Validates that this is Jest test framework and that all dependencies are installed.
 * @private
 */
var _validateJest = function () {
    if (!fs_1.checkFilesExist(fs_1.getPaths().app.jestConfigPath)) {
        return;
    }
    if (!fs_1.resolveModulePath('jest')) {
        prints_1.jestNotInstalled();
        flex_dev_utils_1.exit(1);
    }
};
exports._validateJest = _validateJest;
/**
 * Parses the args passed to the CLI
 * @param args  the args
 * @private
 */
var _parseArgs = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var cleanArgs = [];
    var jestEnv = exports.DEFAULT_JEST_ENV;
    var skipNext = false;
    args.forEach(function (arg, index) {
        if (skipNext) {
            skipNext = false;
            return;
        }
        if (arg === '--env') {
            if (args[index + 1]) {
                jestEnv = args[index + 1];
                skipNext = true;
            }
            return;
        }
        if (arg.indexOf('--env=') === 0) {
            jestEnv = arg.substr('--env='.length);
            return;
        }
        cleanArgs.push(arg);
    });
    return { jestEnv: jestEnv, cleanArgs: cleanArgs };
};
exports._parseArgs = _parseArgs;
/**
 * Runs Jest tests
 */
var test = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, jestEnv, cleanArgs;
        var _b;
        return __generator(this, function (_c) {
            flex_dev_utils_1.logger.debug('Running tests');
            fs_1.addCWDNodeModule();
            flex_dev_utils_1.env.setNodeEnv(env_1.Environment.Test);
            flex_dev_utils_1.env.setBabelEnv(env_1.Environment.Test);
            exports._validateJest();
            _a = exports._parseArgs.apply(void 0, __spreadArray([], __read(args))), jestEnv = _a.jestEnv, cleanArgs = _a.cleanArgs;
            flex_dev_utils_1.logger.clearTerminal();
            flex_dev_utils_1.logger.notice('Running tests...');
            // We run this as a separate module here so that we don't have to import optional `jest` module if not needed
            // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
            (_b = require('./test/test')).default.apply(_b, __spreadArray([jestEnv], __read(cleanArgs)));
            return [2 /*return*/];
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(test);
// eslint-disable-next-line import/no-unused-modules
exports.default = test;
//# sourceMappingURL=test.js.map