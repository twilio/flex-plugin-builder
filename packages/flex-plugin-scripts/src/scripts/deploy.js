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
exports._doDeploy = exports._getAccount = exports._verifyFlexUIConfiguration = exports._verifyPath = void 0;
var flex_dev_utils_1 = require("flex-dev-utils");
var inquirer_1 = require("flex-dev-utils/dist/inquirer");
var fs_1 = require("flex-dev-utils/dist/fs");
var strings_1 = require("flex-dev-utils/dist/strings");
var accounts_1 = __importDefault(require("../clients/accounts"));
var __1 = require("..");
var prints_1 = require("../prints");
var run_1 = __importDefault(require("../utils/run"));
var clients_1 = require("../clients");
var runtime_1 = __importDefault(require("../utils/runtime"));
var allowedBumps = ['major', 'minor', 'patch', 'version'];
/**
 * Verifies the new plugin path does not have collision with existing paths of the deployed Runtime service.
 *
 * @param baseUrl   the baseURL of the file
 * @param build     the existing build
 */
var _verifyPath = function (baseUrl, build) {
    var bundlePath = baseUrl + "/bundle.js";
    var sourceMapPath = baseUrl + "/bundle.js.map";
    var existingAssets = build.asset_versions;
    var existingFunctions = build.function_versions;
    var checkPathIsUnused = function (v) { return v.path !== bundlePath && v.path !== sourceMapPath; };
    return existingAssets.every(checkPathIsUnused) && existingFunctions.every(checkPathIsUnused);
};
exports._verifyPath = _verifyPath;
/**
 * Validates Flex UI version requirement
 * @param flexUI        the flex ui version
 * @param dependencies  the package.json dependencie
 * @param allowReact    whether this deploy supports unbundled React
 * @private
 */
var _verifyFlexUIConfiguration = function (flexUI, dependencies, allowReact) { return __awaiter(void 0, void 0, void 0, function () {
    var coerced, UISupports, reactSupported, reactDOMSupported, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                coerced = flex_dev_utils_1.semver.coerce(flexUI);
                if (!allowReact) {
                    return [2 /*return*/];
                }
                UISupports = flex_dev_utils_1.semver.satisfies('1.19.0', flexUI) || (coerced && flex_dev_utils_1.semver.satisfies(coerced, '>=1.19.0'));
                if (!UISupports) {
                    throw new flex_dev_utils_1.FlexPluginError(strings_1.singleLineString("We detected that your account is using Flex UI version " + flexUI + " which is incompatible", "with unbundled React. Please visit https://flex.twilio.com/admin/versioning and update to", "version 1.19 or above."));
                }
                if (!dependencies.react || !dependencies['react-dom']) {
                    throw new flex_dev_utils_1.FlexPluginError('To use unbundled React, you need to set the React version from the Developer page');
                }
                reactSupported = flex_dev_utils_1.semver.satisfies(fs_1.getPackageVersion('react'), "" + dependencies.react);
                reactDOMSupported = flex_dev_utils_1.semver.satisfies(fs_1.getPackageVersion('react-dom'), "" + dependencies['react-dom']);
                if (!(!reactSupported || !reactDOMSupported)) return [3 /*break*/, 2];
                flex_dev_utils_1.logger.newline();
                flex_dev_utils_1.logger.warning(strings_1.singleLineString("The React version " + fs_1.getPackageVersion('react') + " installed locally", "is incompatible with the React version " + dependencies.react + " installed on your Flex project."));
                flex_dev_utils_1.logger.info(strings_1.singleLineString('Change your local React version or visit https://flex.twilio.com/admin/developers to', "change the React version installed on your Flex project."));
                return [4 /*yield*/, inquirer_1.confirm('Do you still want to continue deploying?', 'N')];
            case 1:
                answer = _a.sent();
                if (!answer) {
                    flex_dev_utils_1.logger.newline();
                    throw new flex_dev_utils_1.UserActionError('User rejected confirmation to deploy with mismatched React version.');
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports._verifyFlexUIConfiguration = _verifyFlexUIConfiguration;
/**
 * Returns the Account object only if credentials provided is AccountSid/AuthToken, otherwise returns a dummy data
 * @param runtime     the {@link Runtime}
 * @param credentials the {@link Credential}
 * @private
 */
var _getAccount = function (runtime, credentials) { return __awaiter(void 0, void 0, void 0, function () {
    var accountClient;
    return __generator(this, function (_a) {
        accountClient = new accounts_1.default(credentials);
        if (credentials.username.startsWith('AC')) {
            return [2 /*return*/, accountClient.get(runtime.service.account_sid)];
        }
        return [2 /*return*/, {
                sid: runtime.service.account_sid,
            }];
    });
}); };
exports._getAccount = _getAccount;
/**
 * The main deploy script. This script performs the following in order:
 * 1. Verifies bundle file exists, if not warns about running `npm run build` first
 * 2. Fetches the default Service and Environment from Serverless API
 * 3. Fetches existing Build
 * 4. Verifies the new bundle path does not collide with files in existing Build
 * 5. Creates a new Asset (and an AssetVersion), and uploads the file to S3 for both the bundle and source map
 * 6. Appends the new two files to existing Build's files and creates a new Build
 * 7. Creates a new deployment and sets the Environment build to the new Build.
 *
 * @param nextVersion   the next version of the bundle
 * @param options       options for this deploy
 */
var _doDeploy = function (nextVersion, options) { return __awaiter(void 0, void 0, void 0, function () {
    var pluginBaseUrl, bundleUri, sourceMapUri, credentials, pluginsApiClient, hasFlag, runtime, pluginUrl, configurationClient, buildClient, assetClient, deploymentClient, allowReact, uiVersion, uiDependencies, routeCollision, buildAssets, buildFunctions, buildDependencies, buildData, deployResult, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!fs_1.checkFilesExist(fs_1.getPaths().app.bundlePath)) {
                    throw new flex_dev_utils_1.FlexPluginError('Could not find build file. Did you run `twilio flex:plugins:build` first?');
                }
                pluginBaseUrl = fs_1.getPaths().assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', nextVersion);
                bundleUri = pluginBaseUrl + "/bundle.js";
                sourceMapUri = pluginBaseUrl + "/bundle.js.map";
                return [4 /*yield*/, flex_dev_utils_1.getCredential()];
            case 1:
                credentials = _c.sent();
                if (!options.isPluginsPilot) return [3 /*break*/, 3];
                pluginsApiClient = new clients_1.PluginsApiClient(credentials);
                return [4 /*yield*/, pluginsApiClient.hasFlag()];
            case 2:
                hasFlag = _c.sent();
                if (!hasFlag) {
                    throw new flex_dev_utils_1.FlexPluginError('This command is currently in Preview and is restricted to users while we work on improving it. If you would like to participate, please contact flex@twilio.com to learn more.');
                }
                prints_1.pluginsApiWarning();
                _c.label = 3;
            case 3:
                flex_dev_utils_1.logger.info('Uploading your Flex plugin to Twilio Assets\n');
                return [4 /*yield*/, runtime_1.default(credentials)];
            case 4:
                runtime = _c.sent();
                if (!runtime.environment) {
                    throw new flex_dev_utils_1.FlexPluginError('No Runtime environment was found');
                }
                pluginUrl = "https://" + runtime.environment.domain_name + bundleUri;
                configurationClient = new clients_1.ConfigurationClient(credentials);
                buildClient = new clients_1.BuildClient(credentials, runtime.service.sid);
                assetClient = new clients_1.AssetClient(credentials, runtime.service.sid);
                deploymentClient = new clients_1.DeploymentClient(credentials, runtime.service.sid, runtime.environment.sid);
                allowReact = process.env.UNBUNDLED_REACT === 'true';
                return [4 /*yield*/, configurationClient.getFlexUIVersion()];
            case 5:
                uiVersion = _c.sent();
                return [4 /*yield*/, configurationClient.getUIDependencies()];
            case 6:
                uiDependencies = _c.sent();
                return [4 /*yield*/, exports._verifyFlexUIConfiguration(uiVersion, uiDependencies, allowReact)];
            case 7:
                _c.sent();
                return [4 /*yield*/, flex_dev_utils_1.progress('Validating the new plugin bundle', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var collision;
                        return __generator(this, function (_a) {
                            collision = runtime.build ? !exports._verifyPath(pluginBaseUrl, runtime.build) : false;
                            if (collision) {
                                if (options.overwrite) {
                                    if (!options.disallowVersioning) {
                                        flex_dev_utils_1.logger.newline();
                                        flex_dev_utils_1.logger.warning('Plugin already exists and the flag --overwrite is going to overwrite this plugin.');
                                    }
                                }
                                else if (flex_dev_utils_1.env.isCI() || !flex_dev_utils_1.env.isCLI()) {
                                    throw new flex_dev_utils_1.FlexPluginError("You already have a plugin with the same version: " + pluginUrl);
                                }
                            }
                            return [2 /*return*/, collision];
                        });
                    }); })];
            case 8:
                routeCollision = _c.sent();
                buildAssets = runtime.build ? runtime.build.asset_versions : [];
                buildFunctions = runtime.build ? runtime.build.function_versions : [];
                buildDependencies = runtime.build ? runtime.build.dependencies : [];
                return [4 /*yield*/, flex_dev_utils_1.progress('Uploading your plugin bundle', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var bundleVersion, sourceMapVersion, existingAssets, data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, assetClient.upload(fs_1.getPaths().app.name, bundleUri, fs_1.getPaths().app.bundlePath, !options.isPublic)];
                                case 1:
                                    bundleVersion = _a.sent();
                                    return [4 /*yield*/, assetClient.upload(fs_1.getPaths().app.name, sourceMapUri, fs_1.getPaths().app.sourceMapPath, !options.isPublic)];
                                case 2:
                                    sourceMapVersion = _a.sent();
                                    existingAssets = routeCollision && options.overwrite
                                        ? buildAssets.filter(function (v) { return v.path !== bundleUri && v.path !== sourceMapUri; })
                                        : buildAssets;
                                    data = {
                                        FunctionVersions: buildFunctions.map(function (v) { return v.sid; }),
                                        AssetVersions: existingAssets.map(function (v) { return v.sid; }),
                                        Dependencies: buildDependencies,
                                    };
                                    data.AssetVersions.push(bundleVersion.sid);
                                    data.AssetVersions.push(sourceMapVersion.sid);
                                    return [2 /*return*/, data];
                            }
                        });
                    }); })];
            case 9:
                buildData = _c.sent();
                // Register service sid with Config service
                return [4 /*yield*/, flex_dev_utils_1.progress('Registering plugin with Flex', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, configurationClient.registerSid(runtime.service.sid)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 10:
                // Register service sid with Config service
                _c.sent();
                deployResult = {
                    serviceSid: runtime.service.sid,
                    accountSid: runtime.service.account_sid,
                    environmentSid: runtime.environment.sid,
                    domainName: runtime.environment.domain_name,
                    isPublic: options.isPublic,
                    nextVersion: nextVersion,
                    pluginUrl: pluginUrl,
                };
                if (routeCollision && !options.overwrite) {
                    return [2 /*return*/, deployResult];
                }
                // Create a build, and poll regularly until build is complete
                return [4 /*yield*/, flex_dev_utils_1.progress('Deploying a new build of your Twilio Runtime', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var newBuild, deployment;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, buildClient.create(buildData)];
                                case 1:
                                    newBuild = _a.sent();
                                    return [4 /*yield*/, deploymentClient.create(newBuild.sid)];
                                case 2:
                                    deployment = _a.sent();
                                    fs_1.updateAppVersion(nextVersion);
                                    return [2 /*return*/, deployment];
                            }
                        });
                    }); })];
            case 11:
                // Create a build, and poll regularly until build is complete
                _c.sent();
                _a = prints_1.deploySuccessful;
                _b = [pluginUrl, options.isPublic];
                return [4 /*yield*/, exports._getAccount(runtime, credentials)];
            case 12:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/, deployResult];
        }
    });
}); };
exports._doDeploy = _doDeploy;
var deploy = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var disallowVersioning, nextVersion, bump, opts;
        return __generator(this, function (_a) {
            __1.setEnvironment.apply(void 0, __spreadArray([], __read(argv)));
            flex_dev_utils_1.logger.debug('Deploying Flex plugin');
            disallowVersioning = argv.includes('--disallow-versioning');
            nextVersion = argv[1];
            bump = argv[0];
            opts = {
                isPublic: argv.includes('--public'),
                overwrite: argv.includes('--overwrite') || disallowVersioning,
                isPluginsPilot: argv.includes('--pilot-plugins-api'),
                disallowVersioning: disallowVersioning,
            };
            if (disallowVersioning) {
                nextVersion = '0.0.0';
            }
            else {
                if (!allowedBumps.includes(bump)) {
                    throw new flex_dev_utils_1.FlexPluginError("Version bump can only be one of " + allowedBumps.join(', '));
                }
                if (bump === 'version' && !argv[1]) {
                    throw new flex_dev_utils_1.FlexPluginError('Custom version bump requires the version value.');
                }
                if (bump === 'overwrite') {
                    opts.overwrite = true;
                    nextVersion = fs_1.getPaths().app.version;
                }
                else if (bump !== 'version') {
                    nextVersion = flex_dev_utils_1.semver.inc(fs_1.getPaths().app.version, bump);
                }
            }
            return [2 /*return*/, exports._doDeploy(nextVersion, opts)];
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(deploy);
// eslint-disable-next-line import/no-unused-modules
exports.default = deploy;
//# sourceMappingURL=deploy.js.map