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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFromGitHub = exports.setupConfiguration = exports.installDependencies = void 0;
var fs_1 = require("flex-dev-utils/dist/fs");
var flex_dev_utils_1 = require("flex-dev-utils");
var lodash_1 = require("flex-dev-utils/dist/lodash");
var github = __importStar(require("../utils/github"));
// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
var pkg = require(fs_1.findUp(__filename, 'package.json'));
/**
 * Install dependencies
 *
 * @param config {FlexPluginArguments} the plugin argument
 * @return {string} the stdout of the execution
 */
var installDependencies = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var shellCmd, args, options, _a, stdout, exitCode, stderr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                shellCmd = config.yarn ? 'yarn' : 'npm';
                args = ['install'];
                options = {
                    cwd: config.targetDirectory,
                    shell: process.env.SHELL,
                };
                return [4 /*yield*/, flex_dev_utils_1.spawn(shellCmd, args, options)];
            case 1:
                _a = _b.sent(), stdout = _a.stdout, exitCode = _a.exitCode, stderr = _a.stderr;
                if (exitCode === 1) {
                    throw new Error(stderr);
                }
                return [2 /*return*/, stdout];
        }
    });
}); };
exports.installDependencies = installDependencies;
/**
 * Appends className to the configuration
 *
 * @param config {FlexPluginArguments}  the plugin configuration
 * @return {FlexPluginArguments} the updated configuration
 */
var setupConfiguration = function (config) {
    var name = config.name || '';
    config.pluginClassName = lodash_1.upperFirst(lodash_1.camelCase(name)).replace('Plugin', '') + "Plugin";
    config.pluginNamespace = name.toLowerCase().replace('plugin-', '');
    config.runtimeUrl = config.runtimeUrl || 'http://localhost:3000';
    config.targetDirectory = fs_1.resolveCwd(name);
    config.flexSdkVersion = pkg.devDependencies['@twilio/flex-ui'];
    config.pluginScriptsVersion = pkg.devDependencies['flex-plugin-scripts'];
    return config;
};
exports.setupConfiguration = setupConfiguration;
/**
 * Downloads content from GitHub
 *
 * @param url {string}                  the GitHub url
 * @param dir {string}                  the temp directory to save the downloaded file to
 */
var downloadFromGitHub = function (url, dir) { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, github.parseGitHubUrl(url)];
            case 1:
                info = _a.sent();
                return [2 /*return*/, github.downloadRepo(info, dir)];
        }
    });
}); };
exports.downloadFromGitHub = downloadFromGitHub;
//# sourceMappingURL=commands.js.map