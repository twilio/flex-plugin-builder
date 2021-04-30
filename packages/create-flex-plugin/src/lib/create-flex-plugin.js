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
exports.createFlexPlugin = exports._scaffold = exports._install = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_2 = require("flex-dev-utils/dist/fs");
var strings_1 = require("flex-dev-utils/dist/strings");
var tmp_1 = require("tmp");
var commands_1 = require("./commands");
var finalMessage_1 = __importDefault(require("../prints/finalMessage"));
var validators_1 = __importDefault(require("../utils/validators"));
var templatesRootDir = path_1.resolve(__dirname, '../../templates');
var templateCorePath = path_1.resolve(templatesRootDir, 'core');
var templateJsPath = path_1.resolve(templatesRootDir, 'js');
var templateTsPath = path_1.resolve(templatesRootDir, 'ts');
/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
var _install = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, flex_dev_utils_1.progress('Installing dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, commands_1.installDependencies(config)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            }); })];
    });
}); };
exports._install = _install;
/**
 * Creates all the directories and copies the templates over
 *
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
var _scaffold = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var dirObject, promise, cleanUp;
    return __generator(this, function (_a) {
        promise = flex_dev_utils_1.progress('Creating project directory', function () { return __awaiter(void 0, void 0, void 0, function () {
            var srcPath, ext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // This copies the core such as public/
                    return [4 /*yield*/, fs_2.copyTemplateDir(templateCorePath, config.targetDirectory, config)];
                    case 1:
                        // This copies the core such as public/
                        _a.sent();
                        srcPath = templateJsPath;
                        if (config.typescript) {
                            srcPath = templateTsPath;
                        }
                        if (!config.template) return [3 /*break*/, 3];
                        dirObject = tmp_1.dirSync();
                        return [4 /*yield*/, commands_1.downloadFromGitHub(config.template, dirObject.name)];
                    case 2:
                        _a.sent();
                        srcPath = dirObject.name;
                        _a.label = 3;
                    case 3: 
                    // This copies the src/ directory
                    return [4 /*yield*/, fs_2.copyTemplateDir(srcPath, config.targetDirectory, config)];
                    case 4:
                        // This copies the src/ directory
                        _a.sent();
                        // Rename plugins
                        if (!dirObject) {
                            ext = config.typescript ? 'tsx' : 'js';
                            fs_1.default.renameSync(path_1.join(config.targetDirectory, "src/DemoPlugin." + ext), path_1.join(config.targetDirectory, "src/" + config.pluginClassName + "." + ext));
                        }
                        return [2 /*return*/, true];
                }
            });
        }); });
        cleanUp = function () {
            if (dirObject) {
                dirObject.removeCallback();
            }
        };
        promise.then(cleanUp).catch(cleanUp);
        return [2 /*return*/, promise];
    });
}); };
exports._scaffold = _scaffold;
/**
 * Creates a Flex Plugin from the {@link FlexPluginArguments}
 * @param config {FlexPluginArguments} the configuration
 */
var createFlexPlugin = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, validators_1.default(config)];
            case 1:
                config = _b.sent();
                config = commands_1.setupConfiguration(config);
                // Check folder does not exist
                if (fs_1.default.existsSync(config.targetDirectory)) {
                    throw new flex_dev_utils_1.FlexPluginError(strings_1.singleLineString("Path " + flex_dev_utils_1.logger.coloredStrings.link(config.targetDirectory) + " already exists;", 'please remove it and try again.'));
                }
                return [4 /*yield*/, exports._scaffold(config)];
            case 2:
                // Setup the directories
                if (!(_b.sent())) {
                    throw new flex_dev_utils_1.FlexPluginError('Failed to scaffold project');
                }
                // Add new plugin to .twilio-cli/flex/plugins.json
                return [4 /*yield*/, fs_2.checkPluginConfigurationExists(config.name, config.targetDirectory)];
            case 3:
                // Add new plugin to .twilio-cli/flex/plugins.json
                _b.sent();
                _a = config.install;
                if (!_a) return [3 /*break*/, 5];
                return [4 /*yield*/, exports._install(config)];
            case 4:
                _a = !(_b.sent());
                _b.label = 5;
            case 5:
                // Install NPM dependencies
                if (_a) {
                    flex_dev_utils_1.logger.error('Failed to install dependencies. Please run `npm install` manually.');
                    config.install = false;
                }
                finalMessage_1.default(config);
                return [2 /*return*/];
        }
    });
}); };
exports.createFlexPlugin = createFlexPlugin;
exports.default = exports.createFlexPlugin;
//# sourceMappingURL=create-flex-plugin.js.map