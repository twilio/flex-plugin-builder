"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersionInput = void 0;
var semver_1 = __importDefault(require("semver"));
var deploy_1 = require("flex-plugin-scripts/dist/scripts/deploy");
var runtime_1 = __importDefault(require("flex-plugin-scripts/dist/utils/runtime"));
var errors_1 = require("@oclif/parser/lib/errors");
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_1 = require("flex-dev-utils/dist/fs");
var inquirer_1 = require("flex-dev-utils/dist/inquirer");
var flags = __importStar(require("../../../utils/flags"));
var general_1 = require("../../../utils/general");
var flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
var ServerlessClient_1 = __importDefault(require("../../../clients/ServerlessClient"));
/**
 * Parses the version input
 * @param input
 */
var parseVersionInput = function (input) {
    if (!semver_1.default.valid(input)) {
        var message = "Flag --version=" + input + " must be a valid SemVer";
        throw new errors_1.CLIParseError({ parse: {}, message: message });
    }
    if (input === '0.0.0') {
        var message = "Flag --version=" + input + " cannot be 0.0.0";
        throw new errors_1.CLIParseError({ parse: {}, message: message });
    }
    return input;
};
exports.parseVersionInput = parseVersionInput;
var baseFlags = __assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Builds and then deploys the Flex Plugin
 */
var FlexPluginsDeploy = /** @class */ (function (_super) {
    __extends(FlexPluginsDeploy, _super);
    function FlexPluginsDeploy(argv, config, secureStorage) {
        var _this = _super.call(this, argv, config, secureStorage, {}) || this;
        _this.nextVersion = undefined;
        _this.scriptArgs = [];
        _this.prints = _this._prints.deploy;
        return _this;
    }
    /**
     * @override
     */
    FlexPluginsDeploy.prototype.doRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, name, hasCollisionAndOverwrite, deployedData, pluginVersion;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkServerlessInstance()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkForLegacy()];
                    case 2:
                        _a.sent();
                        args = ['--quiet', '--persist-terminal'];
                        name = "**" + this.pkg.name + "**";
                        return [4 /*yield*/, flex_dev_utils_1.progress("Validating deployment of plugin " + name, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.validatePlugin()];
                            }); }); }, false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, flex_dev_utils_1.progress("Compiling a production build of " + name, function () { return __awaiter(_this, void 0, void 0, function () {
                                var buildArgs;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.runScript('pre-script-check', args)];
                                        case 1:
                                            _a.sent();
                                            buildArgs = __spreadArray([], __read(args));
                                            if (this.nextVersion) {
                                                buildArgs.push('--version', this.nextVersion);
                                            }
                                            return [2 /*return*/, this.runScript('build', __spreadArray([], __read(buildArgs)))];
                                    }
                                });
                            }); }, false)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.hasCollisionAndOverwrite()];
                    case 5:
                        hasCollisionAndOverwrite = _a.sent();
                        if (hasCollisionAndOverwrite) {
                            args.push('--overwrite');
                        }
                        return [4 /*yield*/, flex_dev_utils_1.progress("Uploading " + name, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.runScript('deploy', __spreadArray(__spreadArray([], __read(this.scriptArgs)), __read(args)))];
                            }); }); }, false)];
                    case 6:
                        deployedData = _a.sent();
                        return [4 /*yield*/, flex_dev_utils_1.progress("Registering plugin " + name + " with Plugins API", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.registerPlugin()];
                            }); }); }, false)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, flex_dev_utils_1.progress("Registering version **v" + deployedData.nextVersion + "** with Plugins API", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.registerPluginVersion(deployedData)];
                            }); }); }, false)];
                    case 8:
                        pluginVersion = _a.sent();
                        this.prints.deploySuccessful(this.pkg.name, pluginVersion.private ? 'private' : 'public', deployedData);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if there is already an uploaded asset with the same version and prompts user with an option to override if so
     * @returns {Promise<boolean>}
     */
    FlexPluginsDeploy.prototype.hasCollisionAndOverwrite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, runtime, pluginBaseUrl, collision;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (flex_dev_utils_1.env.isCI()) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, flex_dev_utils_1.getCredential()];
                    case 1:
                        credentials = _a.sent();
                        return [4 /*yield*/, runtime_1.default(credentials)];
                    case 2:
                        runtime = _a.sent();
                        if (!runtime.environment) {
                            throw new flex_dev_utils_1.FlexPluginError('No Runtime environment was found');
                        }
                        pluginBaseUrl = fs_1.getPaths().assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', this.nextVersion);
                        collision = runtime.build ? !deploy_1._verifyPath(pluginBaseUrl, runtime.build) : false;
                        if (!collision) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, inquirer_1.confirm('Plugin package has already been uploaded previously for this version of the plugin. Would you like to overwrite it?', 'N')];
                }
            });
        });
    };
    /**
     * Validates that the provided next plugin version is valid
     * @returns {Promise<void>}
     */
    FlexPluginsDeploy.prototype.validatePlugin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentVersion, pluginVersion, e_1, nextVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentVersion = '0.0.0';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // Plugin may not exist yet
                        return [4 /*yield*/, this.pluginsClient.get(this.pkg.name)];
                    case 2:
                        // Plugin may not exist yet
                        _a.sent();
                        return [4 /*yield*/, this.pluginVersionsClient.latest(this.pkg.name)];
                    case 3:
                        pluginVersion = _a.sent();
                        currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        nextVersion = this._flags.version || semver_1.default.inc(currentVersion, this.bumpLevel);
                        if (!semver_1.default.valid(nextVersion)) {
                            throw new flex_dev_utils_1.TwilioCliError(nextVersion + " is not a valid semver");
                        }
                        if (!semver_1.default.gt(nextVersion, currentVersion)) {
                            throw new flex_dev_utils_1.TwilioCliError("The provided version " + nextVersion + " must be greater than " + currentVersion);
                        }
                        // Set the plugin version
                        this.nextVersion = nextVersion;
                        this.scriptArgs.push('version', nextVersion);
                        this.scriptArgs.push('--pilot-plugins-api');
                        if (this._flags.public) {
                            this.scriptArgs.push('--public');
                        }
                        return [2 /*return*/, {
                                currentVersion: currentVersion,
                                nextVersion: nextVersion,
                            }];
                }
            });
        });
    };
    /**
     * Registers a plugin with Plugins API
     * @returns {Promise}
     */
    FlexPluginsDeploy.prototype.registerPlugin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pluginsClient.upsert({
                        UniqueName: this.pkg.name,
                        FriendlyName: this.pkg.name,
                        Description: this._flags.description || '',
                    })];
            });
        });
    };
    /**
     * Registers a Plugin Version
     * @param deployResult
     * @returns {Promise}
     */
    FlexPluginsDeploy.prototype.registerPluginVersion = function (deployResult) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pluginVersionsClient.create(this.pkg.name, {
                        Version: deployResult.nextVersion,
                        PluginUrl: deployResult.pluginUrl,
                        Private: !deployResult.isPublic,
                        Changelog: this._flags.changelog || '',
                    })];
            });
        });
    };
    /**
     * Checks whether a Serverless instance exists or not. If not, will create one
     */
    FlexPluginsDeploy.prototype.checkServerlessInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serviceSid, service_1, e_2, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flexConfigurationClient.getServerlessSid()];
                    case 1:
                        serviceSid = _a.sent();
                        if (!serviceSid) return [3 /*break*/, 8];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 8]);
                        return [4 /*yield*/, this.serverlessClient.getService(serviceSid)];
                    case 3:
                        service_1 = _a.sent();
                        if (!(service_1.friendlyName !== ServerlessClient_1.default.NewService.friendlyName)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.serverlessClient.updateServiceName(serviceSid)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                    case 6:
                        e_2 = _a.sent();
                        if (!general_1.instanceOf(e_2, flex_dev_utils_1.TwilioCliError)) {
                            throw e_2;
                        }
                        return [4 /*yield*/, this.flexConfigurationClient.unregisterServerlessSid(serviceSid)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, this.serverlessClient.getOrCreateDefaultService()];
                    case 9:
                        service = _a.sent();
                        return [4 /*yield*/, this.flexConfigurationClient.registerServerlessSid(service.sid)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks to see if a legacy plugin exist
     */
    FlexPluginsDeploy.prototype.checkForLegacy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serviceSid, hasLegacy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.flexConfigurationClient.getServerlessSid()];
                    case 1:
                        serviceSid = _a.sent();
                        if (!serviceSid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.serverlessClient.hasLegacy(serviceSid, this.pkg.name)];
                    case 2:
                        hasLegacy = _a.sent();
                        if (hasLegacy) {
                            this.prints.warnHasLegacy();
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(FlexPluginsDeploy.prototype, "bumpLevel", {
        /**
         * Finds the version bump level
         * @returns {string}
         */
        get: function () {
            if (this._flags.major) {
                return 'major';
            }
            if (this._flags.minor) {
                return 'minor';
            }
            return 'patch';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPluginsDeploy.prototype, "_flags", {
        /**
         * Parses the flags passed to this command
         */
        /* istanbul ignore next */
        get: function () {
            return this.parse(FlexPluginsDeploy).flags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPluginsDeploy.prototype, "checkCompatibility", {
        /**
         * @override
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    FlexPluginsDeploy.topicName = 'flex:plugins:deploy';
    FlexPluginsDeploy.description = general_1.createDescription(FlexPluginsDeploy.topic.description, true);
    FlexPluginsDeploy.flags = __assign(__assign({}, baseFlags), { patch: flags.boolean({
            description: FlexPluginsDeploy.topic.flags.patch,
            exclusive: ['minor', 'major', 'version'],
        }), minor: flags.boolean({
            description: FlexPluginsDeploy.topic.flags.minor,
            exclusive: ['patch', 'major', 'version'],
        }), major: flags.boolean({
            description: FlexPluginsDeploy.topic.flags.major,
            exclusive: ['patch', 'minor', 'version'],
        }), version: flags.string({
            description: FlexPluginsDeploy.topic.flags.version,
            exclusive: ['patch', 'minor', 'major'],
            parse: exports.parseVersionInput,
        }), public: flags.boolean({
            description: FlexPluginsDeploy.topic.flags.public,
            default: false,
        }), changelog: flags.string({
            description: FlexPluginsDeploy.topic.flags.changelog,
            required: true,
            max: 1000,
        }), description: flags.string({
            description: FlexPluginsDeploy.topic.flags.description,
            max: 500,
        }) });
    return FlexPluginsDeploy;
}(flex_plugin_1.default));
exports.default = FlexPluginsDeploy;
//# sourceMappingURL=deploy.js.map