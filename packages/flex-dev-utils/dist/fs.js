"use strict";
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
exports.findInFiles = exports.zipPluginFiles = exports.flexUIPackageDependencyVersion = exports.packageDependencyVersion = exports.isPluginFolder = exports.isPluginDir = exports.getPackageVersion = exports.getDependencyVersion = exports.getPaths = exports._getFlexPluginWebpackPath = exports._getFlexPluginScripts = exports.resolveModulePath = exports.addCWDNodeModule = exports.checkRunPluginConfigurationExists = exports.checkPluginConfigurationExists = exports.findGlobs = exports.findGlobsIn = exports.resolveCwd = exports.rmRfSync = exports.copyTemplateDir = exports.mkdirpSync = exports.findUp = exports.updateAppVersion = exports.readAppPackageJson = exports.getPackageJsonPath = exports.checkAFileExists = exports.copyFile = exports.removeFile = exports.calculateSha256 = exports.checkFilesExist = exports.writeJSONFile = exports.writeFile = exports.readRunPluginsJson = exports.readPluginsJson = exports.getCliPaths = exports.readJsonFile = exports.readFileSync = exports.getCoreCwd = exports.setCoreCwd = exports.getCwd = exports.setCwd = exports.resolveRelative = exports.getFileSizeInMB = exports.getSileSizeInBytes = exports.readPackageJson = exports._setRequirePaths = exports._require = void 0;
var fs_1 = __importStar(require("fs"));
var path = __importStar(require("path"));
var os_1 = __importStar(require("os"));
var util_1 = require("util");
var crypto_1 = __importDefault(require("crypto"));
var find_in_files_1 = __importDefault(require("find-in-files"));
var globby_1 = require("globby");
var mkdirp_1 = __importDefault(require("mkdirp"));
var rimraf_1 = __importDefault(require("rimraf"));
var app_module_path_1 = __importDefault(require("app-module-path"));
var adm_zip_1 = __importDefault(require("adm-zip"));
var questions_1 = require("./questions");
var flexUI = '@twilio/flex-ui';
var react = 'react';
var reactDOM = 'react-dom';
exports.default = fs_1.default;
var packageJsonStr = 'package.json';
/**
 * This is an alias for require. Useful for mocking out in tests
 * @param filePath  the file to require
 * @private
 */
/* c8 ignore next */
// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/explicit-module-boundary-types
var _require = function (filePath) { return require(filePath); };
exports._require = _require;
// Set working directory
var _setRequirePaths = function (requirePath) {
    app_module_path_1.default.addPath(requirePath);
    // Now try to specifically set the node_modules path
    var requirePaths = (require.main && require.main.paths) || [];
    if (!requirePaths.includes(requirePath)) {
        requirePaths.push(requirePath);
    }
};
exports._setRequirePaths = _setRequirePaths;
/**
 * Reads a JSON file
 *
 * @param filePath   the file path to read
 */
var readPackageJson = function (filePath) {
    return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
};
exports.readPackageJson = readPackageJson;
/**
 * Returns the file size in bytes
 * @param filePaths the path to the file
 */
var getSileSizeInBytes = function () {
    var filePaths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filePaths[_i] = arguments[_i];
    }
    return fs_1.statSync(path.join.apply(path, __spreadArray([], __read(filePaths)))).size;
};
exports.getSileSizeInBytes = getSileSizeInBytes;
/**
 * Returns the file size in MB
 * @param filePaths the path to file
 */
var getFileSizeInMB = function () {
    var filePaths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filePaths[_i] = arguments[_i];
    }
    return exports.getSileSizeInBytes.apply(void 0, __spreadArray([], __read(filePaths))) / (1024 * 1024);
};
exports.getFileSizeInMB = getFileSizeInMB;
/**
 * Builds path relative to the given dir
 * @param dir   the dir
 * @param paths the paths
 */
var resolveRelative = function (dir) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    if (paths.length === 0) {
        return dir;
    }
    var lastElement = paths[paths.length - 1];
    // Check if last element is an extension
    if (lastElement.charAt(0) !== '.') {
        return path.join.apply(path, __spreadArray([dir], __read(paths)));
    }
    // Only one entry as extension
    if (paths.length === 1) {
        return path.join("" + dir + lastElement);
    }
    var secondLastElement = paths[paths.length - 2];
    var remainder = paths.slice(0, paths.length - 2);
    return path.join.apply(path, __spreadArray([dir], __read(__spreadArray(__spreadArray([], __read(remainder)), ["" + secondLastElement + lastElement]))));
};
exports.resolveRelative = resolveRelative;
// Working directory
var internalCwd = fs_1.default.realpathSync(process.cwd());
var internalCoreCwd = fs_1.default.realpathSync(process.cwd());
/**
 * Sets the working directory
 * @param p the path to set
 */
var setCwd = function (p) {
    internalCwd = p;
    exports._setRequirePaths(path.join(internalCwd, 'node_modules'));
};
exports.setCwd = setCwd;
/**
 * Returns the working directory
 */
var getCwd = function () { return internalCwd; };
exports.getCwd = getCwd;
/**
 * Sets the core working directory
 * @param p the path to set
 */
var setCoreCwd = function (p) {
    internalCoreCwd = p;
    exports._setRequirePaths(path.join(internalCoreCwd, 'node_modules'));
};
exports.setCoreCwd = setCoreCwd;
/**
 * The core cwd is the working directory of core packages such as flex-plugin-scripts and flex-plugin
 */
var getCoreCwd = function () { return internalCoreCwd; };
exports.getCoreCwd = getCoreCwd;
/**
 * Reads the file
 * @param filePaths  the file paths
 */
var readFileSync = function () {
    var filePaths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filePaths[_i] = arguments[_i];
    }
    return fs_1.default.readFileSync(path.join.apply(path, __spreadArray([], __read(filePaths))), 'utf8');
};
exports.readFileSync = readFileSync;
/**
 * Reads a JSON file (Templated)
 *
 * @param filePaths  the file paths to read
 */
var readJsonFile = function () {
    var filePaths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filePaths[_i] = arguments[_i];
    }
    return JSON.parse(exports.readFileSync.apply(void 0, __spreadArray([], __read(filePaths))));
};
exports.readJsonFile = readJsonFile;
/**
 * Gets the CLI paths. This is separated out from getPaths because create-flex-plugin also needs to read it,
 * but that script will not have flex-plugin-scripts installed which would cause an exception to be thrown.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var getCliPaths = function () {
    var coreCwd = exports.getCoreCwd();
    var coreNodeModulesDir = exports.resolveRelative(coreCwd, 'node_modules');
    var homeDir = os_1.homedir();
    var cliDir = exports.resolveRelative(homeDir, '/.twilio-cli');
    var flexDir = exports.resolveRelative(cliDir, 'flex');
    return {
        dir: cliDir,
        nodeModulesDir: coreNodeModulesDir,
        flexDir: flexDir,
        pluginsJsonPath: exports.resolveRelative(flexDir, 'plugins.json'),
        localPluginsJsonPath: exports.resolveRelative(flexDir, 'locallyRunningPlugins.json'),
    };
};
exports.getCliPaths = getCliPaths;
// Read plugins.json from Twilio CLI
var readPluginsJson = function () {
    return exports.readJsonFile(exports.getCliPaths().pluginsJsonPath);
};
exports.readPluginsJson = readPluginsJson;
// Read plugins.json from Twilio CLI
var readRunPluginsJson = function () {
    return exports.readJsonFile(exports.getCliPaths().localPluginsJsonPath);
};
exports.readRunPluginsJson = readRunPluginsJson;
/**
 * Writes string to file
 */
var writeFile = function (str) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    return fs_1.writeFileSync(path.join.apply(path, __spreadArray([], __read(paths))), str);
};
exports.writeFile = writeFile;
/**
 * Writes an object as a JSON string to the file
 * @param obj the object to write
 * @param paths the path to write to
 */
var writeJSONFile = function (obj) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    return exports.writeFile.apply(void 0, __spreadArray([JSON.stringify(obj, null, 2)], __read(paths)));
};
exports.writeJSONFile = writeJSONFile;
// The OS root directory
var rootDir = os_1.default.platform() === 'win32' ? exports.getCwd().split(path.sep)[0] : '/';
/*
 * Promise version of {@link copyTempDir}
 */
var promiseCopyTempDir = util_1.promisify(exports._require('copy-template-dir'));
/**
 * Checks the provided array of files exist
 *
 * @param files the files to check that they exist
 */
var checkFilesExist = function () {
    var files = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        files[_i] = arguments[_i];
    }
    return files.map(fs_1.default.existsSync).every(function (resp) { return resp; });
};
exports.checkFilesExist = checkFilesExist;
/**
 * Calculates the sha of a file
 * @param paths
 */
/* c8 ignore next */
var calculateSha256 = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var shasum = crypto_1.default.createHash('sha256');
                    var stream = fs_1.createReadStream(path.join.apply(path, __spreadArray([], __read(paths))));
                    stream.on('data', function (data) { return shasum.update(data); });
                    stream.on('error', function (err) { return reject(err); });
                    stream.on('end', function () { return resolve(shasum.digest('hex')); });
                })];
        });
    });
};
exports.calculateSha256 = calculateSha256;
/**
 * Removes a file
 * @param paths
 */
var removeFile = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return fs_1.unlinkSync(path.join.apply(path, __spreadArray([], __read(paths))));
};
exports.removeFile = removeFile;
/**
 * Copies from from src to dest
 * @param srcPaths
 * @param destPaths
 */
var copyFile = function (srcPaths, destPaths) {
    return fs_1.copyFileSync(path.join.apply(path, __spreadArray([], __read(srcPaths))), path.join.apply(path, __spreadArray([], __read(destPaths))));
};
exports.copyFile = copyFile;
/**
 * Checks the provided file exists
 *
 * @param paths the paths to the file
 */
var checkAFileExists = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return fs_1.existsSync(path.join.apply(path, __spreadArray([], __read(paths))));
};
exports.checkAFileExists = checkAFileExists;
/**
 * Gets package.json path
 */
var getPackageJsonPath = function () { return path.join(exports.getCwd(), packageJsonStr); };
exports.getPackageJsonPath = getPackageJsonPath;
/**
 * Reads app package.json from the rootDir.
 */
var readAppPackageJson = function () {
    return exports.readPackageJson(exports.getPackageJsonPath());
};
exports.readAppPackageJson = readAppPackageJson;
/**
 * Updates the package.json version field
 *
 * @param version the new version
 */
var updateAppVersion = function (version) {
    var packageJson = exports.readAppPackageJson();
    packageJson.version = version;
    fs_1.default.writeFileSync(exports.getPackageJsonPath(), JSON.stringify(packageJson, null, 2));
};
exports.updateAppVersion = updateAppVersion;
/**
 * Finds the closest up file relative to dir
 *
 * @param dir   the directory
 * @param file  the file to look for
 */
var findUp = function (dir, file) {
    var resolved = path.resolve(dir);
    if (resolved === rootDir) {
        throw new Error("Reached OS root directory without finding " + file);
    }
    var filePath = path.join(resolved, file);
    if (fs_1.default.existsSync(filePath)) {
        return filePath;
    }
    return exports.findUp(path.resolve(resolved, '..'), file);
};
exports.findUp = findUp;
/**
 * mkdir -p wrapper
 */
exports.mkdirpSync = mkdirp_1.default.sync;
/**
 * Copies a template by applying the variables
 *
 * @param source    the source
 * @param target    the target
 * @param variables the variables
 */
/* c8 ignore next */
// eslint-disable-next-line @typescript-eslint/ban-types
var copyTemplateDir = function (source, target, variables) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, promiseCopyTempDir(source, target, variables)];
    });
}); };
exports.copyTemplateDir = copyTemplateDir;
/**
 * rm -rf sync script
 */
exports.rmRfSync = rimraf_1.default.sync;
/**
 * Builds path relative to cwd
 * @param paths  the paths
 */
var resolveCwd = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return exports.resolveRelative.apply(void 0, __spreadArray([exports.getCwd()], __read(paths)));
};
exports.resolveCwd = resolveCwd;
/**
 * Finds globs in any cwd directory
 * @param dir     the cwd to check for patterns
 * @param patterns the patterns
 */
var findGlobsIn = function (dir) {
    var patterns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        patterns[_i - 1] = arguments[_i];
    }
    return globby_1.sync(patterns, { cwd: dir });
};
exports.findGlobsIn = findGlobsIn;
/**
 * Finds globs in the src directory
 * @param patterns the patterns
 */
var findGlobs = function () {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i] = arguments[_i];
    }
    return exports.findGlobsIn.apply(void 0, __spreadArray([path.join(exports.getCwd(), 'src')], __read(patterns)));
};
exports.findGlobs = findGlobs;
/**
 * Touch ~/.twilio-cli/flex/plugins.json if it does not exist
 * Check if this plugin is in this config file. If not, add it.
 * @param name  the plugin name
 * @param dir   the plugin directory
 * @param promptForOverwrite  whether to prompt for overwrite
 * @return whether the plugin-directory was overwritten
 */
var checkPluginConfigurationExists = function (name, dir, promptForOverwrite) {
    if (promptForOverwrite === void 0) { promptForOverwrite = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var cliPaths, config, plugin, answer, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cliPaths = exports.getCliPaths();
                    if (!exports.checkFilesExist(cliPaths.pluginsJsonPath)) {
                        exports.mkdirpSync(cliPaths.flexDir);
                        exports.writeJSONFile({ plugins: [] }, cliPaths.pluginsJsonPath);
                    }
                    config = exports.readPluginsJson();
                    plugin = config.plugins.find(function (p) { return p.name === name; });
                    if (!plugin) {
                        config.plugins.push({ name: name, dir: dir });
                        exports.writeJSONFile(config, cliPaths.pluginsJsonPath);
                        return [2 /*return*/, true];
                    }
                    if (plugin.dir === dir) {
                        return [2 /*return*/, false];
                    }
                    if (!promptForOverwrite) return [3 /*break*/, 2];
                    return [4 /*yield*/, questions_1.confirm("You already have a plugin called " + plugin.name + " located at " + plugin.dir + ". Do you want to update it to " + dir + "?", 'N')];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = true;
                    _b.label = 3;
                case 3:
                    answer = _a;
                    if (answer) {
                        plugin.dir = dir;
                        exports.writeJSONFile(config, cliPaths.pluginsJsonPath);
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
};
exports.checkPluginConfigurationExists = checkPluginConfigurationExists;
/**
 * Touch ~/.twilio-cli/flex/locallyRunningPlugins.json if it does not exist,
 * and if it does exist, clear the file so it is ready for a new run
 */
var checkRunPluginConfigurationExists = function (localPlugins) { return __awaiter(void 0, void 0, void 0, function () {
    var cliPaths, runConfig, localPlugins_1, localPlugins_1_1, plugin;
    var e_1, _a;
    return __generator(this, function (_b) {
        cliPaths = exports.getCliPaths();
        if (!exports.checkFilesExist(cliPaths.localPluginsJsonPath)) {
            exports.mkdirpSync(cliPaths.flexDir);
        }
        runConfig = { plugins: [], loadedPlugins: [] };
        try {
            for (localPlugins_1 = __values(localPlugins), localPlugins_1_1 = localPlugins_1.next(); !localPlugins_1_1.done; localPlugins_1_1 = localPlugins_1.next()) {
                plugin = localPlugins_1_1.value;
                runConfig.plugins.push(plugin);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (localPlugins_1_1 && !localPlugins_1_1.done && (_a = localPlugins_1.return)) _a.call(localPlugins_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        exports.writeJSONFile(runConfig, cliPaths.localPluginsJsonPath);
        return [2 /*return*/];
    });
}); };
exports.checkRunPluginConfigurationExists = checkRunPluginConfigurationExists;
/**
 * Adds the node_modules to the app module.
 * This is needed because we spawn different scripts when running start/build/test and so we lose
 * the original cwd directory
 */
var addCWDNodeModule = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var indexCoreCwd = args.indexOf('--core-cwd');
    if (indexCoreCwd !== -1) {
        var coreCwd = args[indexCoreCwd + 1];
        if (coreCwd) {
            exports.setCoreCwd(coreCwd);
        }
    }
    var indexCwd = args.indexOf('--cwd');
    if (indexCwd === -1) {
        // This is to setup the app environment
        exports.setCwd(exports.getCwd());
    }
    else {
        var cwd = args[indexCwd + 1];
        if (cwd) {
            exports.setCwd(cwd);
        }
    }
};
exports.addCWDNodeModule = addCWDNodeModule;
/**
 * Returns the absolute path to the pkg if found
 * @param pkg the package to lookup
 */
/* c8 ignore next */
var resolveModulePath = function (pkg) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    try {
        return require.resolve(pkg);
    }
    catch (_a) {
        // Now try to specifically set the node_modules path
        var requirePaths = (require.main && require.main.paths) || [];
        requirePaths.push.apply(requirePaths, __spreadArray([], __read(paths)));
        try {
            return require.resolve(pkg, { paths: requirePaths });
        }
        catch (_b) {
            return false;
        }
    }
};
exports.resolveModulePath = resolveModulePath;
/**
 * Returns the path to flex-plugin-scripts
 */
var _getFlexPluginScripts = function () {
    var flexPluginScriptPath = exports.resolveModulePath('@twilio/flex-plugin-scripts');
    if (flexPluginScriptPath === false) {
        throw new Error('Could not resolve @twilio/flex-plugin-scripts');
    }
    return path.join(path.dirname(flexPluginScriptPath), '..');
};
exports._getFlexPluginScripts = _getFlexPluginScripts;
/**
 * Returns the path to flex-plugin-webpack
 */
var _getFlexPluginWebpackPath = function (scriptsNodeModulesDir) {
    var flexPluginWebpackPath = exports.resolveModulePath('@twilio/flex-plugin-webpack', scriptsNodeModulesDir);
    if (flexPluginWebpackPath === false) {
        throw new Error("Could not resolve @twilio/flex-plugin-webpack");
    }
    return path.join(path.dirname(flexPluginWebpackPath), '..');
};
exports._getFlexPluginWebpackPath = _getFlexPluginWebpackPath;
/**
 * Returns the paths to all modules and directories used in the plugin-builder
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var getPaths = function () {
    var cwd = exports.getCwd();
    var nodeModulesDir = exports.resolveCwd('node_modules');
    var scriptsDir = exports._getFlexPluginScripts();
    var scriptsNodeModulesDir = exports.resolveRelative(scriptsDir, 'node_modules');
    var devAssetsDir = exports.resolveRelative(scriptsDir, 'dev_assets');
    var publicDir = exports.resolveCwd('public');
    var buildDir = exports.resolveCwd('build');
    var srcDir = exports.resolveCwd('src');
    var flexUIDir = exports.resolveRelative(nodeModulesDir, flexUI);
    var tsConfigPath = exports.resolveCwd('tsconfig.json');
    var webpackDir = exports._getFlexPluginWebpackPath(scriptsNodeModulesDir);
    // package.json information
    var pkgName = '';
    var pkgVersion = '';
    // This file can be required in locations that don't have package.json
    try {
        var pkg = exports.readAppPackageJson();
        pkgName = pkg.name;
        pkgVersion = pkg.version;
    }
    catch (e) {
        // no-op
    }
    return {
        cwd: cwd,
        // flex-plugin-webpack paths
        webpack: {
            dir: webpackDir,
            nodeModulesDir: exports.resolveRelative(webpackDir, 'node_modules'),
        },
        // flex-plugin-scripts paths
        scripts: {
            dir: scriptsDir,
            nodeModulesDir: scriptsNodeModulesDir,
            devAssetsDir: devAssetsDir,
            indexHTMLPath: exports.resolveRelative(devAssetsDir, 'index.html'),
            tsConfigPath: exports.resolveRelative(devAssetsDir, 'tsconfig.json'),
        },
        // twilio-cli/flex/plugins.json paths
        cli: exports.getCliPaths(),
        // plugin-app (the customer app)
        app: {
            dir: cwd,
            name: pkgName,
            version: pkgVersion,
            pkgPath: exports.resolveCwd(packageJsonStr),
            jestConfigPath: exports.resolveCwd('jest.config.js'),
            webpackConfigPath: exports.resolveCwd('webpack.config.js'),
            devServerConfigPath: exports.resolveCwd('webpack.dev.js'),
            tsConfigPath: tsConfigPath,
            isTSProject: function () { return exports.checkFilesExist(tsConfigPath); },
            setupTestsPaths: [exports.resolveCwd('setupTests.js'), exports.resolveRelative(srcDir, 'setupTests.js')],
            // .env file support
            envPath: exports.resolveCwd('/.env'),
            hasEnvFile: function () { return exports.checkFilesExist(exports.resolveCwd('/.env')); },
            envExamplePath: exports.resolveCwd('/.env.example'),
            hasEnvExampleFile: function () { return exports.checkFilesExist(exports.resolveCwd('/.env.example')); },
            envDefaultsPath: exports.resolveCwd('/.env.defaults'),
            hasEnvDefaultsPath: function () { return exports.checkFilesExist(exports.resolveCwd('/.env.defaults')); },
            // build/*
            buildDir: buildDir,
            bundlePath: exports.resolveRelative(buildDir, pkgName, '.js'),
            sourceMapPath: exports.resolveRelative(buildDir, pkgName, '.js.map'),
            // src/*
            srcDir: srcDir,
            entryPath: exports.resolveRelative(srcDir, 'index'),
            // node_modules/*,
            nodeModulesDir: nodeModulesDir,
            flexUIDir: flexUIDir,
            flexUIPkgPath: exports.resolveRelative(flexUIDir, packageJsonStr),
            // public/*
            publicDir: publicDir,
            appConfig: exports.resolveRelative(publicDir, 'appConfig.js'),
            // dependencies
            dependencies: {
                react: {
                    version: exports.readPackageJson(exports.resolveRelative(nodeModulesDir, react, packageJsonStr)).version,
                },
                reactDom: {
                    version: exports.readPackageJson(exports.resolveRelative(nodeModulesDir, reactDOM, packageJsonStr)).version,
                },
                flexUI: {
                    version: exports.readPackageJson(exports.resolveRelative(nodeModulesDir, flexUI, packageJsonStr)).version,
                },
            },
        },
        // others
        assetBaseUrlTemplate: "/plugins/" + pkgName + "/%PLUGIN_VERSION%",
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
    };
};
exports.getPaths = getPaths;
/**
 * Returns the version of the dependency that is installed in node_modules
 * @param pkgName  the package name
 * @return the version of the package installed
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
var getDependencyVersion = function (pkgName) {
    try {
        return exports._require(pkgName + "/package.json").version;
    }
    catch (_a) {
        try {
            return exports._require(exports.resolveRelative(exports.getPaths().app.nodeModulesDir, pkgName, packageJsonStr)).version;
        }
        catch (_b) {
            return exports._require(exports.resolveRelative(exports.getPaths().scripts.nodeModulesDir, pkgName, packageJsonStr)).version;
        }
    }
};
exports.getDependencyVersion = getDependencyVersion;
/**
 * Returns the package.json version field of the package
 * @param name  the package
 */
/* c8 ignore next */
var getPackageVersion = function (name) {
    var installedPath = exports.resolveRelative(exports.getPaths().app.nodeModulesDir, name, packageJsonStr);
    return exports.readPackageJson(installedPath).version;
};
exports.getPackageVersion = getPackageVersion;
/**
 * Determines whether the directory is plugin based on the package.json
 * @param packageJson  the package json
 */
var isPluginDir = function (packageJson) {
    return Boolean(packageJson.dependencies[flexUI] || packageJson.devDependencies[flexUI]);
};
exports.isPluginDir = isPluginDir;
/**
 * Determines whether the directory is plugin based on the package.json
 * @param packageJson  the package json
 */
var isPluginFolder = function () {
    if (!exports.checkAFileExists(exports.getPackageJsonPath())) {
        return false;
    }
    var packageJson = exports.readAppPackageJson();
    return Boolean(((packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) && packageJson.dependencies[flexUI]) ||
        ((packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) && packageJson.devDependencies[flexUI]));
};
exports.isPluginFolder = isPluginFolder;
/**
 * Fetches the version corresponding to the dependency inside the given package
 * @param pkg the package.json to check
 * @param name the package to look for
 */
var packageDependencyVersion = function (pkg, name) {
    if (pkg.dependencies && name in pkg.dependencies) {
        return pkg.dependencies[name];
    }
    if (pkg.devDependencies && name in pkg.devDependencies) {
        return pkg.devDependencies[name];
    }
    if (pkg.peerDependencies && name in pkg.peerDependencies) {
        return pkg.peerDependencies[name];
    }
    return null;
};
exports.packageDependencyVersion = packageDependencyVersion;
/**
 * Fetches the version corresponding to the dependency inside the flex-ui package.json
 * @param name the package to check
 */
var flexUIPackageDependencyVersion = function (name) {
    return exports.packageDependencyVersion(exports._require(exports.getPaths().app.flexUIPkgPath), name);
};
exports.flexUIPackageDependencyVersion = flexUIPackageDependencyVersion;
/**
 * Zips plugin files and writes it into the location specified
 * @param location Path where the zip file should be written to
 * @param zipPath Path inside the zip into which the files should be compressed
 * @param files Files to be zipped
 */
var zipPluginFiles = function (location, zipPath) {
    if (zipPath === void 0) { zipPath = ''; }
    var files = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        files[_i - 2] = arguments[_i];
    }
    var zip = new adm_zip_1.default();
    files.forEach(function (file) {
        var isDir = fs_1.statSync(file).isDirectory();
        if (isDir) {
            var folderName = path.parse(file).name;
            zip.addLocalFolder(file, path.join(zipPath, folderName));
        }
        else {
            zip.addLocalFile(file, zipPath);
        }
    });
    zip.writeZip(location);
};
exports.zipPluginFiles = zipPluginFiles;
exports.findInFiles = find_in_files_1.default.find;
//# sourceMappingURL=fs.js.map