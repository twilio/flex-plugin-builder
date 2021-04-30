"use strict";
/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarn = exports.npm = exports.node = exports.spawn = void 0;
var os_1 = __importDefault(require("os"));
var execa_1 = __importDefault(require("execa"));
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var DefaultOptions = { stdio: 'inherit' };
/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
var spawn = function (cmd, args, options) {
    if (options === void 0) { options = DefaultOptions; }
    var defaultOptions = {
        shell: process.env.SHELL,
    };
    // see https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows/37487465
    if (os_1.default.platform() === 'win32') {
        // @ts-ignore
        defaultOptions.shell = true;
    }
    var spawnOptions = __assign(__assign({}, defaultOptions), options);
    var subProcess = execa_1.default(cmd, args, spawnOptions);
    var cancel = subProcess.cancel, kill = subProcess.kill;
    var promise = subProcess
        .then(function (_a) {
        var signal = _a.signal, exitCode = _a.exitCode, stdout = _a.stdout, stderr = _a.stderr;
        if (signal === 'SIGKILL') {
            flex_plugins_utils_logger_1.logger.error(flex_plugins_utils_logger_1.singleLineString('The script has failed because the process exited too early.', 'This probably means the system ran out of memory or someone called', '`kill -9` on the process.'));
        }
        else if (signal === 'SIGTERM') {
            flex_plugins_utils_logger_1.logger.warning(flex_plugins_utils_logger_1.singleLineString('The script has failed because the process exited too early.', 'Someone might have called `kill` or `killall`, or the system could', 'be shutting down.'));
        }
        return {
            exitCode: exitCode || 0,
            stdout: stdout || '',
            stderr: stderr || '',
        };
    })
        .catch(function (e) {
        flex_plugins_utils_logger_1.logger.debug(e);
        return {
            exitCode: e.exitCode || 1,
            stderr: e.message || '',
            stdout: '',
        };
    });
    return Object.assign(promise, { cancel: cancel, kill: kill });
};
exports.spawn = spawn;
/**
 * Spawns a node
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
var node = function (args, options) {
    if (options === void 0) { options = DefaultOptions; }
    return exports.spawn('node', args, options);
};
exports.node = node;
/**
 * Spawns an npm
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
var npm = function (args, options) {
    if (options === void 0) { options = DefaultOptions; }
    return exports.spawn('npm', args, options);
};
exports.npm = npm;
/**
 * Spawns a yarn
 *
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
var yarn = function (args, options) {
    if (options === void 0) { options = DefaultOptions; }
    return exports.spawn('yarn', args, options);
};
exports.yarn = yarn;
exports.default = exports.spawn;
//# sourceMappingURL=spawn.js.map