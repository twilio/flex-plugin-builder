"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
var fs = __importStar(require("fs"));
var package_json_1 = __importDefault(require("package-json"));
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var _1 = require(".");
var utils_1 = require("../utils");
/**
 * RUN_TS is used to determine whether the test scenarios need
 * to be filtered by isTS property value
 */
var RUN_TS = process.env.TS;
/**
 * Main method for running a test
 * @param step the step to run
 * @param params the test params
 */
var runTest = function (step, params) { return __awaiter(void 0, void 0, void 0, function () {
    var stepStr, testFile, testSuite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stepStr = '0'.repeat(Math.max(0, 3 - String(step).length)) + String(step);
                testFile = "step" + stepStr;
                testSuite = require(__dirname + "/../tests/" + testFile).default;
                flex_dev_utils_1.logger.info("Step " + stepStr + " - " + testSuite.description + " ..[" + new Date().toISOString() + "]..");
                if (!testSuite.before) return [3 /*break*/, 2];
                return [4 /*yield*/, testSuite.before(params)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, testSuite(params)];
            case 3:
                _a.sent();
                if (!testSuite.after) return [3 /*break*/, 5];
                return [4 /*yield*/, testSuite.after(params)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * Prints contextual information
 * @param params the test params
 */
var printParameters = function (params) {
    flex_dev_utils_1.logger.info("Running Plugins E2E Test with parameters:");
    Object.keys(params)
        .filter(function (k) { return !params[k].__hidden; })
        .forEach(function (k) {
        var p = __assign({}, params[k]);
        delete p.__hidden;
        flex_dev_utils_1.logger.info("- " + k + ": " + JSON.stringify(p, null, 2));
    });
};
/**
 * Converts the --step arg to steps
 */
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
/**
 * Runs once before all tests
 * @param testParams the {@link TestParams} to use
 */
var beforeAll = function (testParams) { return __awaiter(void 0, void 0, void 0, function () {
    var pkg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(testParams.scenario.packageVersion === 'latest')) return [3 /*break*/, 2];
                return [4 /*yield*/, package_json_1.default('@twilio/flex-plugin', { version: 'latest' })];
            case 1:
                pkg = _a.sent();
                testParams.scenario.packageVersion = pkg.version;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
/**
 * Runs before the test
 */
var beforeEach = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs.existsSync(_1.homeDir)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs.promises.rm(_1.homeDir, { recursive: true, force: true })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, fs.promises.mkdir(_1.homeDir)];
            case 3:
                _a.sent();
                return [4 /*yield*/, utils_1.api.cleanup()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Runs all steps
 * @param testParams    the {@link TestParams}
 * @param testScenarios the {@link TestScenario}
 */
var runAll = function (testParams, testScenarios) { return __awaiter(void 0, void 0, void 0, function () {
    var testScenarios_1, testScenarios_1_1, testScenario, params, i, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, 9, 10]);
                testScenarios_1 = __values(testScenarios), testScenarios_1_1 = testScenarios_1.next();
                _b.label = 1;
            case 1:
                if (!!testScenarios_1_1.done) return [3 /*break*/, 7];
                testScenario = testScenarios_1_1.value;
                params = __assign({}, testParams);
                params.scenario = __assign(__assign({}, params.scenario), testScenario);
                printParameters(params);
                return [4 /*yield*/, beforeEach()];
            case 2:
                _b.sent();
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < _1.testSuites.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, runTest(i + 1, params)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                testScenarios_1_1 = testScenarios_1.next();
                return [3 /*break*/, 1];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (testScenarios_1_1 && !testScenarios_1_1.done && (_a = testScenarios_1.return)) _a.call(testScenarios_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
/**
 * Runs selected steps
 * @param testParams    the {@link TestParams}
 */
var runSelected = function (testParams) { return __awaiter(void 0, void 0, void 0, function () {
    var steps, scenarios, params, scenarios_1, scenarios_1_1, testScenario, i;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                steps = getArgs('--step');
                scenarios = getArgs('--scenario');
                params = __assign({}, testParams);
                try {
                    for (scenarios_1 = __values(scenarios), scenarios_1_1 = scenarios_1.next(); !scenarios_1_1.done; scenarios_1_1 = scenarios_1.next()) {
                        testScenario = scenarios_1_1.value;
                        params.scenario = __assign(__assign({}, params.scenario), JSON.parse(testScenario));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (scenarios_1_1 && !scenarios_1_1.done && (_a = scenarios_1.return)) _a.call(scenarios_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                printParameters(params);
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < steps.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, runTest(parseInt(steps[i], 10), __assign({}, params))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Starts the runner
 * @param testParams    the {@link TestParams} to use
 * @param testScenarios the {@link TestScenario} to test against
 */
var runner = function (testParams, testScenarios) { return __awaiter(void 0, void 0, void 0, function () {
    var _testParams, _testScenario;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _testParams = __assign({}, testParams);
                if (RUN_TS) {
                    // Required for running e2e on windows in CircleCi pipeline
                    _testScenario = testScenarios.filter(function (s) { return s.isTS === Boolean(Number(RUN_TS)); });
                }
                else {
                    _testScenario = __spreadArray([], __read(testScenarios));
                }
                return [4 /*yield*/, beforeAll(_testParams)];
            case 1:
                _a.sent();
                if (!!process.argv.includes('--step')) return [3 /*break*/, 3];
                return [4 /*yield*/, runAll(_testParams, _testScenario)];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3: return [4 /*yield*/, runSelected(_testParams)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = runner;
//# sourceMappingURL=runner.js.map