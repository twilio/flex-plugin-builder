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
exports._doList = void 0;
var flex_dev_utils_1 = require("flex-dev-utils");
var credentials_1 = require("flex-dev-utils/dist/credentials");
var fs_1 = require("flex-dev-utils/dist/fs");
var run_1 = __importDefault(require("../utils/run"));
var serverless_types_1 = require("../clients/serverless-types");
var pluginVersions_1 = __importDefault(require("../prints/pluginVersions"));
var runtime_1 = __importDefault(require("../utils/runtime"));
var PLUGIN_REGEX_STR = '^/plugins/%PLUGIN_NAME%/.*/bundle.js$';
/**
 * Lists all versions of this plugin
 *
 * @param visibilities  the visibility of the version to show. This can be Public, Private or Both
 * @param order         the order of versions. This can be desc or asc
 * @private
 */
var _doList = function (visibilities, order) {
    if (order === void 0) { order = 'asc'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var credentials, runtime, regex, assets, versions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flex_dev_utils_1.logger.info('Fetching all available versions of plugin %s', fs_1.getPaths().app.name);
                    return [4 /*yield*/, credentials_1.getCredential()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, runtime_1.default(credentials)];
                case 2:
                    runtime = _a.sent();
                    regex = new RegExp(PLUGIN_REGEX_STR.replace('%PLUGIN_NAME%', fs_1.getPaths().app.name));
                    assets = (runtime.build && runtime.build.asset_versions) || [];
                    versions = assets.filter(function (a) { return regex.test(a.path); }).filter(function (a) { return visibilities.includes(a.visibility); });
                    if (versions.length === 0) {
                        flex_dev_utils_1.logger.newline();
                        flex_dev_utils_1.logger.info('No versions of plugin %s have been deployed', fs_1.getPaths().app.name);
                        flex_dev_utils_1.logger.newline();
                        flex_dev_utils_1.exit(0);
                        return [2 /*return*/];
                    }
                    if (!runtime.environment) {
                        throw new flex_dev_utils_1.FlexPluginError('No Runtime environment was found');
                    }
                    pluginVersions_1.default(runtime.environment.domain_name, versions, order);
                    return [2 /*return*/];
            }
        });
    });
};
exports._doList = _doList;
/**
 * Checks the process argument and calls the {@link _doList}
 *
 * @param argv
 */
var list = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var publicOnly, privateOnly, order, visibilities;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flex_dev_utils_1.logger.debug('Listing plugin versions');
                    publicOnly = argv.includes('--public-only');
                    privateOnly = argv.includes('--private-only');
                    order = argv.includes('--desc') ? 'desc' : 'asc';
                    if (publicOnly && privateOnly) {
                        throw new flex_dev_utils_1.FlexPluginError('You cannot use --public-only and --private-only flags together.');
                    }
                    visibilities = [];
                    if (publicOnly) {
                        visibilities.push(serverless_types_1.Visibility.Public);
                    }
                    else if (privateOnly) {
                        visibilities.push(serverless_types_1.Visibility.Protected);
                    }
                    else {
                        visibilities.push(serverless_types_1.Visibility.Public);
                        visibilities.push(serverless_types_1.Visibility.Protected);
                    }
                    return [4 /*yield*/, exports._doList(visibilities, order)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(list);
// eslint-disable-next-line import/no-unused-modules
exports.default = list;
//# sourceMappingURL=list.js.map