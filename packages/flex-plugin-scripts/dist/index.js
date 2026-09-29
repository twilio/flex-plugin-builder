#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironment = exports.PLUGIN_INPUT_PARSER_REGEX = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var spawn_1 = require("@twilio/flex-dev-utils/dist/spawn");
var fs_2 = require("@twilio/flex-dev-utils/dist/fs");
// eslint-disable-next-line import/no-unused-modules
var flex_plugin_webpack_1 = require("@twilio/flex-plugin-webpack");
Object.defineProperty(exports, "PLUGIN_INPUT_PARSER_REGEX", { enumerable: true, get: function () { return flex_plugin_webpack_1.PLUGIN_INPUT_PARSER_REGEX; } });
var spawnScript = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var dir, files, scripts, scriptIndex, script, options, nodeArgs, scriptPath, scriptArgs, processArgs, exitCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = path_1.dirname(__filename);
                    files = fs_1.readdirSync(path_1.join(dir, 'scripts'));
                    scripts = files
                        .filter(function (f) {
                        var ext = f.split('.').pop();
                        return ext === 'js' || ext === 'ts';
                    })
                        .map(function (f) { return f.split('.')[0]; })
                        .filter(function (f) { return f !== 'run'; });
                    scripts = __spreadArray([], __read(new Set(scripts)));
                    scriptIndex = argv.findIndex(function (x) { return scripts.includes(x); });
                    script = scriptIndex !== -1 && argv[scriptIndex];
                    if (!script) {
                        options = flex_dev_utils_1.logger.colors.blue(scripts.join(', '));
                        flex_dev_utils_1.logger.error("Unknown script '" + script + "'; please choose from one of: " + options + ".");
                        flex_dev_utils_1.exit(1);
                        return [2 /*return*/];
                    }
                    nodeArgs = scriptIndex > 0 ? argv.slice(0, scriptIndex) : [];
                    scriptPath = require.resolve("./scripts/" + script);
                    scriptArgs = argv.slice(scriptIndex + 1);
                    processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);
                    // Temp disallow version while we figure this out
                    if (script !== 'test') {
                        processArgs.push('--disallow-versioning');
                    }
                    fs_2.addCWDNodeModule.apply(void 0, __spreadArray([], __read(processArgs)));
                    // Backwards Compatibility 'npm run start'
                    if (fs_2.getCwd().includes('plugin-') && !processArgs.includes(fs_2.getPaths().app.name)) {
                        processArgs.push('--name');
                        processArgs.push(fs_2.getPaths().app.name);
                    }
                    processArgs.push('--run-script');
                    return [4 /*yield*/, spawn_1.spawn('node', processArgs)];
                case 1:
                    exitCode = (_a.sent()).exitCode;
                    flex_dev_utils_1.exit(exitCode, argv);
                    return [2 /*return*/];
            }
        });
    });
};
/**
 * Sets the environment variables from the argv command line
 * @param argv
 */
var setEnvironment = function () {
    var argv = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argv[_i] = arguments[_i];
    }
    if (argv.includes('--quiet')) {
        flex_dev_utils_1.env.setQuiet();
    }
    if (argv.includes('--persist-terminal')) {
        flex_dev_utils_1.env.persistTerminal();
    }
};
exports.setEnvironment = setEnvironment;
exports.default = spawnScript;
//# sourceMappingURL=index.js.map