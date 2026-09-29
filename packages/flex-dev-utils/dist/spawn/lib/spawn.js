"use strict";
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
exports.DefaultOptions = void 0;
/* eslint-disable import/no-unused-modules, @typescript-eslint/ban-types, @typescript-eslint/promise-function-async */
var os_1 = __importDefault(require("os"));
var execa_1 = __importDefault(require("execa"));
var logger_1 = require("../../logger");
exports.DefaultOptions = { stdio: 'inherit' };
/**
 * A wrapper for spawn
 *
 * @param cmd       the shell command node vs yarn to use
 * @param args      the spawn arguments
 * @param options   the spawn options
 */
// @ts-ignore
var spawn = function (cmd, args, options) {
    if (options === void 0) { options = exports.DefaultOptions; }
    return __awaiter(void 0, void 0, void 0, function () {
        var defaultOptions, spawnOptions, subProcess, cancel, kill, promise;
        return __generator(this, function (_a) {
            defaultOptions = {
                shell: process.env.SHELL,
            };
            // see https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows/37487465
            if (os_1.default.platform() === 'win32') {
                // @ts-ignore
                defaultOptions.shell = true;
            }
            spawnOptions = __assign(__assign({}, defaultOptions), options);
            subProcess = execa_1.default(cmd, args, spawnOptions);
            cancel = subProcess.cancel, kill = subProcess.kill;
            promise = subProcess
                .then(function (_a) {
                var signal = _a.signal, exitCode = _a.exitCode, stdout = _a.stdout, stderr = _a.stderr;
                if (signal === 'SIGKILL') {
                    logger_1.logger.error(logger_1.singleLineString('The script has failed because the process exited too early.', 'This probably means the system ran out of memory or someone called', '`kill -9` on the process.'));
                }
                else if (signal === 'SIGTERM') {
                    logger_1.logger.warning(logger_1.singleLineString('The script has failed because the process exited too early.', 'Someone might have called `kill` or `killall`, or the system could', 'be shutting down.'));
                }
                return {
                    exitCode: exitCode || 0,
                    stdout: stdout || '',
                    stderr: stderr || '',
                };
            })
                .catch(function (e) {
                logger_1.logger.debug(e);
                return {
                    exitCode: e.exitCode || 1,
                    stderr: e.message || '',
                    stdout: '',
                };
            });
            return [2 /*return*/, Object.assign(promise, { cancel: cancel, kill: kill })];
        });
    });
};
exports.default = spawn;
//# sourceMappingURL=spawn.js.map