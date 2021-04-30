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
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
/**
 * Wrapper Twilio Serverless Public API
 */
var ServerlessClient = /** @class */ (function () {
    function ServerlessClient(client, logger) {
        this.client = client;
        this.logger = logger;
    }
    /**
     * Returns a service instance
     * @param serviceSid
     */
    ServerlessClient.prototype.getService = function (serviceSid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.get(serviceSid).fetch()];
            });
        });
    };
    /**
     * Lists all services
     */
    ServerlessClient.prototype.listServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.list()];
            });
        });
    };
    /**
     * Creates a service instance
     */
    ServerlessClient.prototype.getOrCreateDefaultService = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listServices()];
                    case 1:
                        list = _a.sent();
                        service = list.find(function (i) { return i.uniqueName === ServerlessClient.NewService.uniqueName; });
                        if (service) {
                            return [2 /*return*/, service];
                        }
                        return [2 /*return*/, this.client.create(ServerlessClient.NewService)];
                }
            });
        });
    };
    /**
     * Updates the service name
     * @param serviceSid  the service sid to update
     */
    ServerlessClient.prototype.updateServiceName = function (serviceSid) {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get(serviceSid).fetch()];
                    case 1:
                        service = _a.sent();
                        service.friendlyName = ServerlessClient.NewService.friendlyName;
                        return [2 /*return*/, service.update()];
                }
            });
        });
    };
    /**
     * Determines if the given plugin has a legacy (v0.0.0) bundle
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    ServerlessClient.prototype.hasLegacy = function (serviceSid, pluginName) {
        return __awaiter(this, void 0, void 0, function () {
            var build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBuildAndEnvironment(serviceSid, pluginName)];
                    case 1:
                        build = (_a.sent()).build;
                        if (!build) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, Boolean(this.getLegacyAsset(build, pluginName))];
                }
            });
        });
    };
    /**
     * Removes the legacy bundle (v0.0.0)
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    ServerlessClient.prototype.removeLegacy = function (serviceSid, pluginName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, build, environment, assets, functions, data, newBuild;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getBuildAndEnvironment(serviceSid, pluginName)];
                    case 1:
                        _a = _b.sent(), build = _a.build, environment = _a.environment;
                        if (!build || !environment) {
                            return [2 /*return*/];
                        }
                        if (!this.getLegacyAsset(build, pluginName)) {
                            return [2 /*return*/];
                        }
                        assets = build.assetVersions
                            .map(function (asset) { return asset; })
                            .filter(function (asset) { return !asset.path.includes("/plugins/" + pluginName + "/0.0.0/bundle.js"); })
                            .map(function (asset) { return asset.sid; });
                        functions = build.functionVersions.map(function (func) { return func; }).map(function (func) { return func.sid; });
                        data = {
                            assetVersions: assets,
                            functionVersions: functions,
                            // @ts-ignore this is a type definition error in Twilio; dependencies should be object[] not a string
                            dependencies: build.dependencies,
                        };
                        return [4 /*yield*/, this.createBuild(serviceSid, data)];
                    case 2:
                        newBuild = _b.sent();
                        return [4 /*yield*/, environment.deployments().create({ buildSid: newBuild.sid })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetches the {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    ServerlessClient.prototype.getBuildAndEnvironment = function (serviceSid, pluginName) {
        return __awaiter(this, void 0, void 0, function () {
            var service, list, environment, build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get(serviceSid).fetch()];
                    case 1:
                        service = _a.sent();
                        if (!service) {
                            return [2 /*return*/, {}];
                        }
                        return [4 /*yield*/, this.client.get(serviceSid).environments.list()];
                    case 2:
                        list = _a.sent();
                        environment = list.find(function (e) { return e.uniqueName === pluginName; });
                        if (!environment || !environment.buildSid) {
                            return [2 /*return*/, {}];
                        }
                        return [4 /*yield*/, this.client.get(serviceSid).builds.get(environment.buildSid).fetch()];
                    case 3:
                        build = _a.sent();
                        return [2 /*return*/, {
                                build: build,
                                environment: environment,
                            }];
                }
            });
        });
    };
    /**
     * Creates a new {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param data the {@link BuildListInstanceCreateOptions}
     */
    ServerlessClient.prototype.createBuild = function (serviceSid, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var newBuild, sid, timeoutId, intervalId;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.client.get(serviceSid).builds.create(data)];
                                case 1:
                                    newBuild = _a.sent();
                                    this.logger.debug("Created build " + newBuild.sid);
                                    sid = newBuild.sid;
                                    timeoutId = setTimeout(function () {
                                        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
                                        clearInterval(intervalId);
                                        reject(new flex_dev_utils_1.TwilioApiError(11205, 'Timeout while waiting for new Twilio Runtime build status to change to complete.', 408));
                                    }, ServerlessClient.timeoutMsec);
                                    intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var build;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.client.get(serviceSid).builds.get(sid).fetch()];
                                                case 1:
                                                    build = _a.sent();
                                                    this.logger.debug("Waiting for build status '" + build.status + "' to change to 'completed'");
                                                    if (build.status === 'failed') {
                                                        clearInterval(intervalId);
                                                        clearTimeout(timeoutId);
                                                        reject(new flex_dev_utils_1.TwilioApiError(20400, 'Twilio Runtime build has failed.', 400));
                                                    }
                                                    if (build.status === 'completed') {
                                                        clearInterval(intervalId);
                                                        clearTimeout(timeoutId);
                                                        resolve(build);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, ServerlessClient.pollingIntervalMsec);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Internal method to determine if the build has a legacy bundle
     * @param build   the {@link BuildInstance}
     * @param pluginName the plugin name
     * @private
     */
    ServerlessClient.prototype.getLegacyAsset = function (build, pluginName) {
        return build.assetVersions
            .map(function (asset) { return asset; })
            .find(function (asset) { return asset.path === "/plugins/" + pluginName + "/0.0.0/bundle.js"; });
    };
    ServerlessClient.NewService = {
        uniqueName: 'default',
        friendlyName: 'Flex Plugins Service (Autogenerated) - Do Not Delete',
    };
    ServerlessClient.timeoutMsec = 30000;
    ServerlessClient.pollingIntervalMsec = 500;
    return ServerlessClient;
}());
exports.default = ServerlessClient;
//# sourceMappingURL=ServerlessClient.js.map