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
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeDir = void 0;
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
var fs_1 = require("fs");
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var utils_1 = require("./utils");
var testSuites = fs_1.readdirSync(__dirname + "/tests")
    .filter(function (f) { return f.endsWith('.js'); })
    .filter(function (f) { return f.startsWith('step'); })
    .sort(function (l, r) {
    if (parseInt(l.split('step')[1], 10) > parseInt(r.split('step')[1], 10)) {
        return 1;
    }
    return -1;
});
exports.homeDir = process.env.HOME + "/.local";
var pluginName = 'flex-e2e-tester-plugin';
var testParams = {
    packageVersion: process.env.PACKAGE_VERSION,
    nodeVersion: process.env.NODE_VERSION,
    homeDir: exports.homeDir,
    plugin: {
        name: pluginName,
        dir: exports.homeDir + "/" + pluginName,
    },
};
var getArgs = function (flag) {
    var _get = function () {
        var argv = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            argv[_i] = arguments[_i];
        }
        var index = argv.indexOf(flag);
        if (index === -1) {
            return [];
        }
        var arg = argv[index + 1];
        return __spreadArray([arg], __read(_get.apply(void 0, __spreadArray([], __read(argv.splice(index + 1))))));
    };
    return _get.apply(void 0, __spreadArray([], __read(process.argv)));
};
var runTest = function (step) { return __awaiter(void 0, void 0, void 0, function () {
    var stepStr, testFile, testSuite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stepStr = '0'.repeat(Math.max(0, 3 - String(step).length)) + String(step);
                testFile = "step" + stepStr;
                testSuite = require(__dirname + "/tests/" + testFile).default;
                flex_plugins_utils_logger_1.logger.info("Step " + stepStr + " - " + testSuite.description);
                return [4 /*yield*/, testSuite(testParams)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, steps, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs_1.existsSync(exports.homeDir)) {
                    fs_1.mkdirSync(exports.homeDir);
                }
                flex_plugins_utils_logger_1.logger.info("Running Plugins E2E Test with parameters:");
                Object.keys(testParams).forEach(function (key) { return flex_plugins_utils_logger_1.logger.info("- " + key + ": " + JSON.stringify(testParams[key])); });
                return [4 /*yield*/, utils_1.api.cleanup()];
            case 1:
                _a.sent();
                if (!!process.argv.includes('--step')) return [3 /*break*/, 6];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < testSuites.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, runTest(i + 1)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
            case 6:
                steps = getArgs('--step');
                i = 0;
                _a.label = 7;
            case 7:
                if (!(i < steps.length)) return [3 /*break*/, 10];
                return [4 /*yield*/, runTest(parseInt(steps[i], 10))];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 7];
            case 10: return [2 /*return*/];
        }
    });
}); })()
    .then(function () {
    flex_plugins_utils_logger_1.logger.success('All E2E tests passed successfully');
})
    .catch(function (e) {
    flex_plugins_utils_logger_1.logger.error('Failed to run E2E tests');
    flex_plugins_utils_logger_1.logger.info(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
});
//# sourceMappingURL=index.js.map