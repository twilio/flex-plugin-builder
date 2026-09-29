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
var path_1 = require("path");
var os_1 = __importDefault(require("os"));
var perf_hooks_1 = require("perf_hooks");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var __1 = require("..");
var run_1 = __importDefault(require("../utils/run"));
var clients_1 = require("../clients");
var prints_1 = require("../prints");
var LEGAL_DISCLAIMER = 'By running the Flex plugins validate command, you acknowledge that the recommendations offered by this tool are suggestions to help with your Flex plugin deployment, but may not represent the only solution available to you. It is ultimately your responsibility to validate these recommendations and determine if they are appropriate for your use case.';
var ETIMEDOUT = 'ETIMEDOUT';
/**
 * Builds the bundle
 */
var validate = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var isDeploy, isFlexUI2, paths, zipFile, credentials, governorClient, flexUIVersion, pkgName, start, zipPlugin, validatePlugin, report, validateFile, e_1, errResponse, errMessage, timedOut, end;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    isDeploy = argv.includes('--deploy');
                    isFlexUI2 = argv.includes('--flex-ui-2.0');
                    flex_dev_utils_1.logger.debug('Running validation on Flex plugin bundle');
                    __1.setEnvironment.apply(void 0, __spreadArray([], __read(argv)));
                    fs_1.addCWDNodeModule.apply(void 0, __spreadArray([], __read(argv)));
                    // Do not print these log statements if validate is run as part of deploy command
                    if (!isDeploy) {
                        flex_dev_utils_1.logger.clearTerminal();
                        flex_dev_utils_1.logger.notice('Validating Plugin...');
                    }
                    flex_dev_utils_1.logger.notice(flex_dev_utils_1.logger.coloredStrings.bold(flex_dev_utils_1.logger.coloredStrings.underline('\nDISCLAIMER')));
                    flex_dev_utils_1.logger.notice("" + flex_dev_utils_1.logger.wrap(LEGAL_DISCLAIMER, process.stdout.columns || 100) + (isDeploy ? '' : '\n'));
                    paths = fs_1.getPaths();
                    zipFile = path_1.resolve(os_1.default.tmpdir(), "tmp-" + Date.now() + ".zip");
                    return [4 /*yield*/, flex_dev_utils_1.getCredential()];
                case 1:
                    credentials = _d.sent();
                    governorClient = new clients_1.GovernorClient(credentials.username, credentials.password);
                    flexUIVersion = isFlexUI2 ? '2.x' : fs_1.getPackageVersion('@twilio/flex-ui');
                    pkgName = flex_dev_utils_1.logger.coloredStrings.bold.yellow(paths.app.name);
                    start = perf_hooks_1.performance.now();
                    zipPlugin = function () {
                        var dirName = path_1.basename(paths.cwd);
                        fs_1.zipPluginFiles(zipFile, dirName, paths.app.srcDir, paths.app.pkgPath);
                        flex_dev_utils_1.logger.debug("zipped plugin files into folder " + dirName + " inside zip file " + zipFile);
                    };
                    validatePlugin = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, governorClient.validate(zipFile, paths.app.name, flexUIVersion)];
                        });
                    }); };
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 8, , 9]);
                    if (!isDeploy) return [3 /*break*/, 4];
                    zipPlugin();
                    return [4 /*yield*/, validatePlugin()];
                case 3:
                    report = _d.sent();
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, flex_dev_utils_1.progress('Preparing the plugin', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, zipPlugin()];
                    }); }); })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, flex_dev_utils_1.progress("Validating plugin " + flex_dev_utils_1.logger.coloredStrings.bold(paths.app.name), function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, validatePlugin()];
                        }); }); })];
                case 6:
                    report = _d.sent();
                    _d.label = 7;
                case 7:
                    // Generate a log file if report is not empty
                    if (report.api_compatibility.length > 0 ||
                        ((_a = report.version_compatibility[0]) === null || _a === void 0 ? void 0 : _a.warnings.length) > 0 ||
                        report.dom_manipulation.length > 0 ||
                        report.errors.length > 0) {
                        if (!fs_1.checkAFileExists(paths.cwd, 'logs')) {
                            fs_1.mkdirpSync('logs');
                        }
                        validateFile = path_1.join(paths.cwd, 'logs', "validate-" + report.request_id + ".json");
                        fs_1.writeJSONFile(report, validateFile);
                    }
                    // Print validation report
                    prints_1.validateSuccessful(report);
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _d.sent();
                    errResponse = (_b = e_1.response) === null || _b === void 0 ? void 0 : _b.data;
                    errMessage = (errResponse === null || errResponse === void 0 ? void 0 : errResponse.message) || (errResponse === null || errResponse === void 0 ? void 0 : errResponse.params.error_detail);
                    timedOut = (e_1 === null || e_1 === void 0 ? void 0 : e_1.code) === ETIMEDOUT;
                    fs_1.removeFile(zipFile);
                    flex_dev_utils_1.logger.newline();
                    if (timedOut) {
                        flex_dev_utils_1.logger.error('Plugin validation timed out. Note: This may be an enterprise firewall issue');
                    }
                    else if (errMessage) {
                        flex_dev_utils_1.logger.error("" + errMessage);
                    }
                    else {
                        flex_dev_utils_1.logger.error('Unable to validate the plugin at the moment.');
                    }
                    if (isDeploy) {
                        return [2 /*return*/, {
                                violations: [],
                                vtime: 0,
                                error: {
                                    message: e_1 === null || e_1 === void 0 ? void 0 : e_1.message,
                                    timedOut: timedOut,
                                },
                            }];
                    }
                    flex_dev_utils_1.logger.error("\n\nValidation of plugin " + pkgName + " failed");
                    throw new flex_dev_utils_1.TwilioCliError();
                case 9:
                    fs_1.removeFile(zipFile);
                    end = perf_hooks_1.performance.now();
                    return [2 /*return*/, {
                            violations: __spreadArray(__spreadArray([], __read(report.api_compatibility.reduce(function (acc, _a) {
                                var warnings = _a.warnings;
                                return __spreadArray(__spreadArray([], __read(acc)), __read(warnings.map(function (_a) {
                                    var id = _a.id;
                                    return id;
                                })));
                            }, []))), __read((((_c = report.version_compatibility[0]) === null || _c === void 0 ? void 0 : _c.warnings.map(function (_a) {
                                var id = _a.id;
                                return id;
                            })) || []))),
                            vtime: end - start,
                        }];
            }
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(validate);
// eslint-disable-next-line import/no-unused-modules
exports.default = validate;
//# sourceMappingURL=validate.js.map