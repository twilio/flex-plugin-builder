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
exports._comparePluginAndCLIVersions = exports._setPluginDir = exports._checkPluginCount = exports._readIndexPage = exports._checkExternalDepsVersions = exports._verifyPackageVersion = exports._validateTypescriptProject = exports._hasTypescriptFiles = exports.flags = exports.FLAG_MULTI_PLUGINS = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var fs_2 = require("@twilio/flex-dev-utils/dist/fs");
var prints_1 = require("../prints");
var run_1 = __importDefault(require("../utils/run"));
var parser_1 = require("../utils/parser");
var extensions = ['js', 'jsx', 'ts', 'tsx'];
var PackagesToVerify = ['react', 'react-dom'];
var packageJsonName = 'package.json';
exports.FLAG_MULTI_PLUGINS = '--multi-plugins-pilot';
exports.flags = [exports.FLAG_MULTI_PLUGINS];
/**
 * Returns true if there are any .d.ts/.ts/.tsx files
 */
/* c8 ignore next */
var _hasTypescriptFiles = function () {
    return fs_2.findGlobs('**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts').length !== 0;
};
exports._hasTypescriptFiles = _hasTypescriptFiles;
/**
 * Validates the TypeScript project
 * @private
 */
var _validateTypescriptProject = function () {
    if (!exports._hasTypescriptFiles()) {
        return;
    }
    if (!fs_2.resolveModulePath('typescript')) {
        prints_1.typescriptNotInstalled();
        flex_dev_utils_1.exit(1);
        return;
    }
    if (fs_2.checkFilesExist(fs_2.getPaths().app.tsConfigPath)) {
        return;
    }
    flex_dev_utils_1.logger.clearTerminal();
    flex_dev_utils_1.env.persistTerminal();
    flex_dev_utils_1.logger.warning('No tsconfig.json was found, creating a default one.');
    fs_1.copyFileSync(fs_2.getPaths().scripts.tsConfigPath, fs_2.getPaths().app.tsConfigPath);
};
exports._validateTypescriptProject = _validateTypescriptProject;
/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * @param flexUIPkg   the flex-ui package.json
 * @param allowSkip   whether to allow skip
 * @param name        the package to check
 * @private
 */
var _verifyPackageVersion = function (flexUIPkg, allowSkip, name) {
    var expectedDependency = fs_2.packageDependencyVersion(flexUIPkg, name);
    if (!expectedDependency) {
        prints_1.expectedDependencyNotFound(name);
        flex_dev_utils_1.exit(1);
        return;
    }
    // @ts-ignore
    var requiredVersion = flex_dev_utils_1.semver.coerce(expectedDependency).version;
    var installedPath = fs_2.resolveRelative(fs_2.getPaths().app.nodeModulesDir, name, packageJsonName);
    var installedVersion = fs_2._require(installedPath).version;
    var supportsUnbundled = flex_dev_utils_1.versionSatisfiesRange(flexUIPkg.version, '>=1.19.0');
    if (requiredVersion !== installedVersion) {
        if (supportsUnbundled) {
            return;
        }
        prints_1.unbundledReactMismatch(flexUIPkg.version, name, installedVersion, allowSkip);
        if (!allowSkip) {
            flex_dev_utils_1.exit(1);
        }
    }
};
exports._verifyPackageVersion = _verifyPackageVersion;
/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * allowSkip  whether to allow skip
 * @private
 */
/* c8 ignore next */
var _checkExternalDepsVersions = function (allowSkip) {
    var flexUIPkg = fs_2._require(fs_2.getPaths().app.flexUIPkgPath);
    PackagesToVerify.forEach(function (name) { return exports._verifyPackageVersion(flexUIPkg, allowSkip, name); });
};
exports._checkExternalDepsVersions = _checkExternalDepsVersions;
/**
 * Returns the content of src/index
 * @private
 */
/* c8 ignore next */
var _readIndexPage = function () {
    var srcIndexPath = path_1.join(fs_2.getCwd(), 'src', 'index');
    var match = extensions.map(function (ext) { return srcIndexPath + "." + ext; }).find(function (file) { return fs_2.checkFilesExist(file); });
    if (match) {
        return fs_1.readFileSync(match, 'utf8');
    }
    throw new flex_dev_utils_1.FlexPluginError('No index file was found in your src directory');
};
exports._readIndexPage = _readIndexPage;
/**
 * Checks how many plugins this single JS bundle is exporting
 * You can only have one plugin per JS bundle
 * @private
 */
var _checkPluginCount = function () {
    var content = exports._readIndexPage();
    var match = content.match(/\.loadPlugin\(/g);
    if (!match || match.length === 0) {
        prints_1.loadPluginCountError(0);
        flex_dev_utils_1.exit(1);
        return;
    }
    if (match.length > 1) {
        prints_1.loadPluginCountError(match.length);
        flex_dev_utils_1.exit(1);
    }
};
exports._checkPluginCount = _checkPluginCount;
/**
 * Attempts to set the cwd of the plugin
 * @param args  the CLI args
 * @private
 */
var _setPluginDir = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (!fs_2.checkFilesExist(fs_2.getCliPaths().pluginsJsonPath)) {
        return;
    }
    var userInputPlugins = parser_1.parseUserInputPlugins.apply(void 0, __spreadArray([false], __read(args)));
    var plugin = parser_1.findFirstLocalPlugin(userInputPlugins);
    if (plugin && fs_2.checkFilesExist(plugin.dir)) {
        fs_2.setCwd(plugin.dir);
    }
};
exports._setPluginDir = _setPluginDir;
/**
 * Compares the CLI and the plugin for flex-plugin-scripts
 * @private
 */
var _comparePluginAndCLIVersions = function () {
    var cliPackageJson = fs_2.readPackageJson(path_1.join(fs_2.getCliPaths().dir, packageJsonName));
    var pluginPackageJson = fs_2.readPackageJson(path_1.join(fs_2.getCwd(), packageJsonName));
    var cliVersion = flex_dev_utils_1.semver.coerce(fs_2.packageDependencyVersion(cliPackageJson, '@twilio-labs/plugin-flex'));
    var pluginVersion = flex_dev_utils_1.semver.coerce(fs_2.packageDependencyVersion(pluginPackageJson, '@twilio/flex-plugin-scripts'));
    if (cliVersion && pluginVersion && cliVersion.version !== pluginVersion.version) {
        var earlierVersion = cliVersion.version < pluginVersion.version ? 'CLI' : '@twilio/flex-plugin-scripts';
        flex_dev_utils_1.logger.warning("The Flex Plugins CLI version installed is different from the version used by your plugin. The Plugins CLI version installed is " + cliVersion.version + " and the version used by your plugin is " + pluginVersion.version + ". Run the upgrade plugin command to use the installed version.");
    }
};
exports._comparePluginAndCLIVersions = _comparePluginAndCLIVersions;
/**
 * Runs pre-start/build checks
 */
var preScriptCheck = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var hasPackageJson, packageJson, pkgName, resetPluginDirectory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flex_dev_utils_1.logger.debug('Checking Flex plugin project directory');
                    fs_2.addCWDNodeModule.apply(void 0, __spreadArray([], __read(args)));
                    exports._setPluginDir.apply(void 0, __spreadArray([], __read(args)));
                    hasPackageJson = fs_2.checkAFileExists(process.cwd(), packageJsonName);
                    if (!hasPackageJson) return [3 /*break*/, 2];
                    packageJson = fs_2.readPackageJson(path_1.join(process.cwd(), packageJsonName));
                    if (!fs_2.isPluginDir(packageJson)) return [3 /*break*/, 2];
                    pkgName = packageJson.name;
                    if (!pkgName) {
                        throw new flex_dev_utils_1.FlexPluginError('No package name was found');
                    }
                    return [4 /*yield*/, fs_2.checkPluginConfigurationExists(pkgName, process.cwd(), args.includes(exports.FLAG_MULTI_PLUGINS))];
                case 1:
                    resetPluginDirectory = _a.sent();
                    if (resetPluginDirectory) {
                        exports._setPluginDir.apply(void 0, __spreadArray([], __read(args)));
                    }
                    _a.label = 2;
                case 2:
                    exports._checkExternalDepsVersions(flex_dev_utils_1.env.skipPreflightCheck());
                    exports._checkPluginCount();
                    exports._validateTypescriptProject();
                    exports._comparePluginAndCLIVersions();
                    return [2 /*return*/];
            }
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(preScriptCheck);
// eslint-disable-next-line import/no-unused-modules
exports.default = preScriptCheck;
//# sourceMappingURL=pre-script-check.js.map