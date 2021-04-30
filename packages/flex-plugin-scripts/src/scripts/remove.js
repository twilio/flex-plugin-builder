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
exports._doRemove = exports._getRuntime = void 0;
var flex_dev_utils_1 = require("flex-dev-utils");
var errors_1 = require("flex-dev-utils/dist/errors");
var inquirer_1 = require("flex-dev-utils/dist/inquirer");
var fs_1 = require("flex-dev-utils/dist/fs");
var clients_1 = require("../clients");
var run_1 = __importDefault(require("../utils/run"));
var runtime_1 = __importDefault(require("../utils/runtime"));
/**
 * Attempts to fetch the Service and Environment. If no Environment is found, will quit the script
 *
 * @param credentials the credentials
 * @private
 */
var _getRuntime = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var runtime, environmentClient, environment, e_1, pluginName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runtime_1.default(credentials, true)];
            case 1:
                runtime = _a.sent();
                environmentClient = new clients_1.EnvironmentClient(credentials, runtime.service.sid);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, environmentClient.get(false)];
            case 3:
                environment = _a.sent();
                return [2 /*return*/, {
                        environment: environment,
                        service: runtime.service,
                    }];
            case 4:
                e_1 = _a.sent();
                pluginName = flex_dev_utils_1.logger.colors.blue(fs_1.getPaths().app.name);
                flex_dev_utils_1.logger.newline();
                flex_dev_utils_1.logger.info("\u26A0\uFE0F  Plugin " + pluginName + " was not found or was already removed.");
                flex_dev_utils_1.exit(0);
                // This is to make TS happy
                return [2 /*return*/, {}];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports._getRuntime = _getRuntime;
/**
 * Performs the delete action
 * @private
 */
var _doRemove = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pluginName, credentials, runtime, environment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pluginName = flex_dev_utils_1.logger.colors.blue(fs_1.getPaths().app.name);
                return [4 /*yield*/, flex_dev_utils_1.getCredential()];
            case 1:
                credentials = _a.sent();
                return [4 /*yield*/, exports._getRuntime(credentials)];
            case 2:
                runtime = _a.sent();
                if (!runtime.environment) {
                    throw new errors_1.FlexPluginError('No Runtime environment was found');
                }
                environment = runtime.environment;
                return [4 /*yield*/, flex_dev_utils_1.progress("Deleting plugin " + pluginName, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var environmentClient;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    environmentClient = new clients_1.EnvironmentClient(credentials, runtime.service.sid);
                                    return [4 /*yield*/, environmentClient.remove(environment.sid)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                flex_dev_utils_1.logger.newline();
                flex_dev_utils_1.logger.info("\uD83C\uDF89\uFE0F  Plugin " + pluginName + " was successfully removed.");
                flex_dev_utils_1.exit(0);
                return [2 /*return*/];
        }
    });
}); };
exports._doRemove = _doRemove;
/**
 * Removes the plugin by deleting it's associated Environment
 */
var remove = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pluginName, question, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                flex_dev_utils_1.logger.debug('Removing plugin');
                pluginName = flex_dev_utils_1.logger.colors.blue(fs_1.getPaths().app.name);
                question = "Are you sure you want to permanently remove plugin " + pluginName + "?";
                return [4 /*yield*/, inquirer_1.confirm(question, 'N')];
            case 1:
                answer = _a.sent();
                if (!answer) {
                    flex_dev_utils_1.exit(0);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, exports._doRemove()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(remove);
// eslint-disable-next-line import/no-unused-modules
exports.default = remove;
//# sourceMappingURL=remove.js.map