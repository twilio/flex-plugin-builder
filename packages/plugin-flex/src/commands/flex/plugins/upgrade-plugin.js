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
/* eslint-disable sonarjs/no-identical-functions */
var path_1 = require("path");
var rimraf_1 = __importDefault(require("rimraf"));
var semver_1 = __importDefault(require("semver"));
var fs_1 = require("flex-dev-utils/dist/fs");
var package_json_1 = __importDefault(require("package-json"));
var parser_1 = require("@oclif/parser");
var flex_dev_utils_1 = require("flex-dev-utils");
var flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
var general_1 = require("../../../utils/general");
var baseFlags = __assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
var FlexPluginsUpgradePlugin = /** @class */ (function (_super) {
    __extends(FlexPluginsUpgradePlugin, _super);
    function FlexPluginsUpgradePlugin(argv, config, secureStorage) {
        var _this = _super.call(this, argv, config, secureStorage, {}) || this;
        _this.prints = _this._prints.upgradePlugin;
        _this.parse(FlexPluginsUpgradePlugin);
        return _this;
    }
    /**
     * @override
     */
    FlexPluginsUpgradePlugin.prototype.doRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._flags['remove-legacy-plugin']) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.removeLegacyPlugin()];
                    case 1:
                        _b.sent();
                        this.prints.removeLegacyPluginSucceeded(this.pkg.name);
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.prints.upgradeNotification(this._flags.yes)];
                    case 3:
                        _b.sent();
                        _a = this.pkgVersion;
                        switch (_a) {
                            case 1: return [3 /*break*/, 4];
                            case 2: return [3 /*break*/, 6];
                            case 3: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, this.upgradeFromV1()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 6: return [4 /*yield*/, this.upgradeFromV2()];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 8: return [4 /*yield*/, this.upgradeFromV3()];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.upgradeToLatest()];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 12: return [4 /*yield*/, this.cleanupNodeModules()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, this.npmInstall()];
                    case 14:
                        _b.sent();
                        this.prints.scriptSucceeded(!this._flags.install);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrade from v1 to v4
     */
    FlexPluginsUpgradePlugin.prototype.upgradeFromV1 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.prints.scriptStarted('v1');
                        return [4 /*yield*/, this.cleanupScaffold()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updatePackageJson(this.getDependencyUpdates(), function (pkg) {
                                delete pkg['config-overrides-path'];
                                return pkg;
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.removePackageScripts([
                                { name: 'build', it: 'react-app-rewired build' },
                                { name: 'eject', it: 'react-app-rewired eject' },
                                { name: 'start', it: 'react-app-rewired start', pre: 'flex-check-start' },
                                { name: 'test', it: 'react-app-rewired test --env=jsdom' },
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrade from v2 to v4
     */
    FlexPluginsUpgradePlugin.prototype.upgradeFromV2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.prints.scriptStarted('v2');
                        return [4 /*yield*/, this.cleanupScaffold()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updatePackageJson(this.getDependencyUpdates(), function (pkg) {
                                delete pkg['config-overrides-path'];
                                return pkg;
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.removePackageScripts([
                                { name: 'build', it: 'craco build' },
                                { name: 'eject', it: 'craco eject' },
                                { name: 'start', it: 'craco start', pre: 'npm run bootstrap' },
                                { name: 'test', it: 'craco test --env=jsdom' },
                                { name: 'coverage', it: 'craco test --env=jsdom --coverage --watchAll=false' },
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrade from v3 to v4
     */
    FlexPluginsUpgradePlugin.prototype.upgradeFromV3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.prints.scriptStarted('v3');
                        return [4 /*yield*/, this.cleanupScaffold()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updatePackageJson(this.getDependencyUpdates())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.removePackageScripts([
                                { name: 'bootstrap', it: 'flex-plugin check-start' },
                                { name: 'build', it: 'flex-plugin build', pre: 'rimraf build && npm run bootstrap' },
                                { name: 'clear', it: 'flex-plugin clear' },
                                { name: 'deploy', it: 'flex-plugin deploy', pre: 'npm run build' },
                                { name: 'eject', it: 'flex-plugin eject' },
                                { name: 'info', it: 'flex-plugin info' },
                                { name: 'list', it: 'flex-plugin list' },
                                { name: 'remove', it: 'flex-plugin remove' },
                                { name: 'start', it: 'flex-plugin start', pre: 'npm run bootstrap' },
                                { name: 'test', it: 'flex-plugin test --env=jsdom' },
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Upgrades the packages to the latest version
     */
    FlexPluginsUpgradePlugin.prototype.upgradeToLatest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.prints.upgradeToLatest();
                        return [4 /*yield*/, this.updatePackageJson(this.getDependencyUpdates())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes craco.config.js file
     */
    FlexPluginsUpgradePlugin.prototype.cleanupScaffold = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flex_dev_utils_1.progress('Cleaning up the scaffold', function () { return __awaiter(_this, void 0, void 0, function () {
                            var warningLogged, sha, publicFiles, newLines_1, ignoreLines_1, index;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        warningLogged = false;
                                        if (!fs_1.checkAFileExists(this.cwd, 'craco.config.js')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, fs_1.calculateSha256(this.cwd, 'craco.config.js')];
                                    case 1:
                                        sha = _a.sent();
                                        if (sha === FlexPluginsUpgradePlugin.cracoConfigSha) {
                                            fs_1.removeFile(this.cwd, 'craco.config.js');
                                        }
                                        else {
                                            this.prints.cannotRemoveCraco(!warningLogged);
                                            warningLogged = true;
                                        }
                                        _a.label = 2;
                                    case 2:
                                        publicFiles = ['index.html', 'pluginsService.js', 'plugins.json', 'plugins.local.build.json'];
                                        publicFiles.forEach(function (file) {
                                            if (fs_1.checkAFileExists(_this.cwd, 'public', file)) {
                                                fs_1.removeFile(_this.cwd, 'public', file);
                                            }
                                        });
                                        fs_1.copyFile([require.resolve('create-flex-plugin'), '..', '..', 'templates', 'core', 'public', 'appConfig.example.js'], [this.cwd, 'public', 'appConfig.example.js']);
                                        ['jest.config.js', 'webpack.config.js', 'webpack.dev.js'].forEach(function (file) {
                                            fs_1.copyFile([require.resolve('create-flex-plugin'), '..', '..', 'templates', 'core', file], [_this.cwd, file]);
                                        });
                                        if (fs_1.checkAFileExists(this.cwd, 'public', 'appConfig.js')) {
                                            newLines_1 = [];
                                            ignoreLines_1 = [
                                                '// set to /plugins.json for local dev',
                                                '// set to /plugins.local.build.json for testing your build',
                                                '// set to "" for the default live plugin loader',
                                            ];
                                            fs_1.readFileSync(this.cwd, 'public', 'appConfig.js')
                                                .split('\n')
                                                .forEach(function (line) {
                                                if (ignoreLines_1.includes(line) || line.startsWith('var pluginServiceUrl')) {
                                                    return;
                                                }
                                                newLines_1.push(line);
                                            });
                                            index = newLines_1.findIndex(function (line) { return line.indexOf('url: pluginServiceUrl') !== -1; });
                                            if (index === -1) {
                                                this.prints.updatePluginUrl(!warningLogged);
                                            }
                                            else {
                                                newLines_1[index] = newLines_1[index].replace('url: pluginServiceUrl', "url: '/plugins'");
                                            }
                                            fs_1.writeFile(newLines_1.join('\n'), this.cwd, 'public', 'appConfig.js');
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the package json by removing the provided list and updating the version to the latest from the given list.
     * Provide the list as key:value. If value is *, then script will find the latest available version.
     * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
     * @param custom        a custom callback for modifying package.json
     */
    FlexPluginsUpgradePlugin.prototype.updatePackageJson = function (dependencies, custom) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logger.debug('Updating package dependencies to', dependencies);
                        return [4 /*yield*/, flex_dev_utils_1.progress('Updating package dependencies', function () { return __awaiter(_this, void 0, void 0, function () {
                                var pkg, beta, addDep;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            pkg = this.pkg;
                                            dependencies.remove.forEach(function (name) { return delete pkg.dependencies[name]; });
                                            dependencies.remove.forEach(function (name) { return delete pkg.devDependencies[name]; });
                                            beta = this._flags.beta;
                                            addDep = function (deps, record) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b, _i, dep, version, conditional, match, fallbackVersion, option, scriptPkg;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            _a = [];
                                                            for (_b in deps)
                                                                _a.push(_b);
                                                            _i = 0;
                                                            _c.label = 1;
                                                        case 1:
                                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                            dep = _a[_i];
                                                            if (!deps.hasOwnProperty(dep)) return [3 /*break*/, 3];
                                                            version = deps[dep];
                                                            this._logger.debug("Adding dependency " + dep + "@" + version);
                                                            conditional = version.split('||').map(function (str) { return str.trim(); });
                                                            if (conditional.length === 2) {
                                                                match = conditional.find(function (str) { return pkg.dependencies[str] || pkg.devDependencies[str]; });
                                                                if (match) {
                                                                    record[dep] = pkg.dependencies[match] || pkg.devDependencies[match];
                                                                    return [3 /*break*/, 3];
                                                                }
                                                                fallbackVersion = conditional.find(function (str) { return semver_1.default.valid(str); });
                                                                if (fallbackVersion) {
                                                                    record[dep] = fallbackVersion;
                                                                    return [3 /*break*/, 3];
                                                                }
                                                            }
                                                            // If we have provided a specific version, use that
                                                            if (version !== '*') {
                                                                record[dep] = version;
                                                                return [3 /*break*/, 3];
                                                            }
                                                            option = FlexPluginsUpgradePlugin.pluginBuilderScripts.includes(dep) && beta ? { version: 'beta' } : {};
                                                            return [4 /*yield*/, package_json_1.default(dep, option)];
                                                        case 2:
                                                            scriptPkg = _c.sent();
                                                            if (!scriptPkg) {
                                                                this.prints.packageNotFound(dep);
                                                                this.exit(1);
                                                                return [2 /*return*/];
                                                            }
                                                            record[dep] = scriptPkg.version;
                                                            _c.label = 3;
                                                        case 3:
                                                            _i++;
                                                            return [3 /*break*/, 1];
                                                        case 4: return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            return [4 /*yield*/, addDep(dependencies.deps, pkg.dependencies)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, addDep(dependencies.devDeps, pkg.devDependencies)];
                                        case 2:
                                            _a.sent();
                                            if (custom) {
                                                custom(pkg);
                                            }
                                            delete pkg.browserslist;
                                            fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes scripts from the package.json
     * @param scripts the scripts remove
     */
    FlexPluginsUpgradePlugin.prototype.removePackageScripts = function (scripts) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flex_dev_utils_1.progress('Removing package scripts', function () { return __awaiter(_this, void 0, void 0, function () {
                            var pkg;
                            var _this = this;
                            return __generator(this, function (_a) {
                                pkg = this.pkg;
                                scripts.forEach(function (script) {
                                    var hasScript = pkg.scripts[script.name] === script.it;
                                    var hasPre = pkg.scripts["pre" + script.name] === script.pre;
                                    var hasPost = pkg.scripts["post" + script.name] === script.post;
                                    if (hasScript && hasPre && hasPost) {
                                        delete pkg.scripts[script.name];
                                        delete pkg.scripts["pre" + script.name];
                                        delete pkg.scripts["post" + script.name];
                                    }
                                    else if (pkg.scripts[script.name]) {
                                        _this.prints.warnNotRemoved("Script {{" + script.name + "}} was not removed because it has been modified");
                                    }
                                });
                                pkg.scripts.postinstall = 'flex-plugin pre-script-check';
                                fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cleans up node_modules and lockfiles
     */
    FlexPluginsUpgradePlugin.prototype.cleanupNodeModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, flex_dev_utils_1.progress('Cleaning up node_modules and lock files', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, rimraf_1.default.sync(path_1.join(this.cwd, 'node_modules'))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, rimraf_1.default.sync(path_1.join(this.cwd, 'package-lock.json'))];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, rimraf_1.default.sync(path_1.join(this.cwd, 'yarn.lock'))];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Runs npm install if flag is set
     */
    FlexPluginsUpgradePlugin.prototype.npmInstall = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._flags.install) {
                            return [2 /*return*/];
                        }
                        cmd = this._flags.yarn ? 'yarn' : 'npm';
                        return [4 /*yield*/, flex_dev_utils_1.progress("Installing dependencies using " + cmd, function () { return __awaiter(_this, void 0, void 0, function () {
                                var args, _a, exitCode, stderr;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            args = ['install'];
                                            if (this._flags.yarn) {
                                                args.push('--silent');
                                            }
                                            else {
                                                args.push('--quiet', '--no-fund', '--no-audit', '--no-progress', '--silent');
                                            }
                                            return [4 /*yield*/, flex_dev_utils_1.spawn(cmd, args)];
                                        case 1:
                                            _a = _b.sent(), exitCode = _a.exitCode, stderr = _a.stderr;
                                            if (exitCode || stderr) {
                                                this._logger.error(stderr);
                                                this.exit(1);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes the legacy plugin
     */
    FlexPluginsUpgradePlugin.prototype.removeLegacyPlugin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name, e_1, serviceSid, hasLegacy;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = this.pkg.name;
                        return [4 /*yield*/, this.prints.removeLegacyNotification(name, this._flags.yes)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.pluginsClient.get(name)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        if (general_1.instanceOf(e_1, flex_dev_utils_1.TwilioApiError) && e_1.status === 404) {
                            this.prints.warningPluginNotInAPI(name);
                            this.exit(1);
                            return [2 /*return*/];
                        }
                        throw e_1;
                    case 5: return [4 /*yield*/, this.flexConfigurationClient.getServerlessSid()];
                    case 6:
                        serviceSid = _a.sent();
                        if (!serviceSid) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.serverlessClient.hasLegacy(serviceSid, name)];
                    case 7:
                        hasLegacy = _a.sent();
                        if (!hasLegacy) {
                            this.prints.noLegacyPluginFound(name);
                            this.exit(0);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, flex_dev_utils_1.progress('Deleting your legacy plugin', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.serverlessClient.removeLegacy(serviceSid, name)];
                            }); }); }, false)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FlexPluginsUpgradePlugin.prototype.getDependencyUpdates = function () {
        return {
            remove: FlexPluginsUpgradePlugin.packagesToRemove,
            deps: {
                'flex-plugin-scripts': '*',
                react: 'react || 16.5.2',
                'react-dom': 'react || 16.5.2',
            },
            devDeps: {
                '@twilio/flex-ui': '^1',
                'react-test-renderer': 'react || 16.5.2',
            },
        };
    };
    Object.defineProperty(FlexPluginsUpgradePlugin.prototype, "pkgVersion", {
        /**
         * Returns the flex-plugin-scripts version from the plugin
         */
        get: function () {
            var _a;
            var pkg = this.pkg.dependencies['flex-plugin-scripts'] ||
                this.pkg.devDependencies['flex-plugin-scripts'] ||
                this.pkg.dependencies['flex-plugin'] ||
                this.pkg.devDependencies['flex-plugin'];
            if (!pkg) {
                throw new flex_dev_utils_1.TwilioCliError("Package 'flex-plugin-scripts' was not found");
            }
            return (_a = semver_1.default.coerce(pkg)) === null || _a === void 0 ? void 0 : _a.major;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPluginsUpgradePlugin.prototype, "_flags", {
        /**
         * Parses the flags passed to this command
         */
        get: function () {
            return this.parse(FlexPluginsUpgradePlugin).flags;
        },
        enumerable: false,
        configurable: true
    });
    FlexPluginsUpgradePlugin.topicName = 'flex:plugins:upgrade-plugin';
    FlexPluginsUpgradePlugin.description = general_1.createDescription(FlexPluginsUpgradePlugin.topic.description, false);
    FlexPluginsUpgradePlugin.flags = __assign(__assign({}, baseFlags), { 'remove-legacy-plugin': parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.removeLegacyPlugin,
        }), install: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.install,
        }), beta: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.beta,
        }), dev: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.dev,
        }), nightly: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.nightly,
        }), yarn: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.yarn,
        }), yes: parser_1.flags.boolean({
            description: FlexPluginsUpgradePlugin.topic.flags.yes,
        }) });
    FlexPluginsUpgradePlugin.cracoConfigSha = '4a8ecfec7b70da88a0849b7b0163808b2cc46eee08c9ab599c8aa3525ff01546';
    FlexPluginsUpgradePlugin.pluginBuilderScripts = ['flex-plugin-scripts', 'flex-plugin'];
    FlexPluginsUpgradePlugin.packagesToRemove = [
        'flex-plugin-scripts',
        'react-app-rewire-flex-plugin',
        'react-app-rewired',
        'react-scripts',
        'enzyme',
        'babel-polyfill',
        'enzyme-adapter-react-16',
        'react-emotion',
        '@craco/craco',
        'craco-config-flex-plugin',
        'core-j',
        'react-test-renderer',
        'react-scripts',
        'rimraf',
        '@types/enzyme',
        '@types/jest',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/react-redux',
        'flex-plugin',
    ];
    return FlexPluginsUpgradePlugin;
}(flex_plugin_1.default));
exports.default = FlexPluginsUpgradePlugin;
//# sourceMappingURL=upgrade-plugin.js.map