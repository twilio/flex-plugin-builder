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
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryOnError = exports.killChildProcess = exports.logResult = exports.promisifiedSpawn = void 0;
/* eslint-disable import/no-unused-modules */
var child_process_1 = require("child_process");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var core_1 = require("../core");
/**
 * Logs the output in real time
 */
var logInfo = function (data, level) {
    data = data.toString().trim();
    if (data) {
        flex_dev_utils_1.logger[level]("[" + new Date().toUTCString() + "] -", data.toString().replace(/-/g, '\\-'));
    }
};
/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
var promisifiedSpawn = function (cmd, args, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // eslint-disable-next-line consistent-return
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var defaultOptions = {
                    cwd: core_1.homeDir,
                    env: {
                        PATH: core_1.testParams.environment.path + ":/" + core_1.homeDir + "/bin",
                        TWILIO_ACCOUNT_SID: core_1.testParams.secrets.api.accountSid,
                        TWILIO_AUTH_TOKEN: core_1.testParams.secrets.api.authToken,
                        TWILIO_REGION: core_1.testParams.config.region,
                        NODE_OPTIONS: core_1.testParams.environment.nodeOptions,
                    },
                    shell: true,
                };
                var spawnOptions = __assign(__assign({}, defaultOptions), options);
                flex_dev_utils_1.logger.info("Running spawn command: **" + cmd + " " + args.join(' ').replace(/-/g, '\\-') + "**");
                flex_dev_utils_1.logger.debug("Spawn options are **" + JSON.stringify(spawnOptions) + "**");
                var child = child_process_1.spawn(cmd, args, spawnOptions);
                var stdoutArr = [];
                var stderrArr = [];
                // errors
                child.on('error', reject);
                child.stdin.on('error', reject);
                child.stdout.on('error', reject);
                child.stderr.setEncoding('utf8');
                child.stderr.on('error', reject);
                child.stderr.on('data', function (data) {
                    logInfo(data, 'warning');
                    if (typeof data === 'string') {
                        stderrArr.push(Buffer.from(data, 'utf-8'));
                    }
                    else {
                        stderrArr.push(data);
                    }
                });
                // data
                child.stdout.on('data', function (data) {
                    logInfo(data, 'info');
                    if (typeof data === 'string') {
                        stdoutArr.push(Buffer.from(data, 'utf-8'));
                    }
                    else {
                        stdoutArr.push(data);
                    }
                });
                child.on('close', function (code) {
                    var stdout = Buffer.concat(stdoutArr).toString();
                    var stderr = Buffer.concat(stderrArr).toString();
                    if (code === 0) {
                        return resolve({ stdout: stdout, stderr: stderr });
                    }
                    return reject(new Error("Command exited with code " + code + " and message " + stdout + ": " + stderr));
                });
                if (options === null || options === void 0 ? void 0 : options.detached) {
                    return resolve({
                        stdout: Buffer.concat(stdoutArr).toString(),
                        stderr: Buffer.concat(stderrArr).toString(),
                        child: child,
                    });
                }
            })];
    });
}); };
exports.promisifiedSpawn = promisifiedSpawn;
/**
 * Helper for logging the result from a spawn
 * @param result the result to log
 */
var logResult = function (result) {
    flex_dev_utils_1.logger.info(result.stdout.replace(/-/g, '\\-'));
    if (result.stderr) {
        flex_dev_utils_1.logger.warning(result.stderr.replace(/-/g, '\\-'));
    }
};
exports.logResult = logResult;
/**
 * Kills child process
 * @param child child process to kill
 * @param os operating system
 */
var killChildProcess = function (child, os, retry) {
    if (retry === void 0) { retry = 2; }
    return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!child) {
                        throw new Error('Could not kill child process, process does not exist');
                    }
                    if (!(os === 'win32')) return [3 /*break*/, 9];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 8]);
                    if (!(retry !== 2)) return [3 /*break*/, 3];
                    flex_dev_utils_1.logger.error("Checking current status of process " + child.pid);
                    return [4 /*yield*/, exports.promisifiedSpawn('tasklist', ['/v', '/fi', "\"PID eq " + child.pid + "\""])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, exports.promisifiedSpawn('taskkill', ['/pid', "" + child.pid, '/f', '/t'])];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    e_1 = _a.sent();
                    flex_dev_utils_1.logger.error("Error killing the process: " + e_1 + "}");
                    if (!(retry > 0)) return [3 /*break*/, 7];
                    flex_dev_utils_1.logger.info('Retrying to kill the process');
                    return [4 /*yield*/, exports.killChildProcess(child, os, retry - 1)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    child.kill();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.killChildProcess = killChildProcess;
var retryOnError = function (method, onError, onFinally, maxRetries) { return __awaiter(void 0, void 0, void 0, function () {
    var attempts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                attempts = 1;
                _a.label = 1;
            case 1:
                if (!(attempts <= maxRetries)) return [3 /*break*/, 10];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 9]);
                return [4 /*yield*/, method(attempts === 1)];
            case 3:
                _a.sent(); // Attempt the main operation
                return [3 /*break*/, 10]; // If operation succeeds, exit the loop
            case 4:
                error_1 = _a.sent();
                flex_dev_utils_1.logger.info('Error occured', error_1);
                if (!(attempts === maxRetries)) return [3 /*break*/, 7];
                return [4 /*yield*/, onError(error_1)];
            case 5:
                _a.sent(); // Handle error if all retries fail
                return [4 /*yield*/, onFinally()];
            case 6:
                _a.sent(); // cleanup
                throw new Error("Operation failed after " + maxRetries + " retries");
            case 7:
                flex_dev_utils_1.logger.info("Attempt " + attempts + " failed. Retrying...");
                attempts += 1;
                _a.label = 8;
            case 8: return [3 /*break*/, 9];
            case 9: return [3 /*break*/, 1];
            case 10: return [4 /*yield*/, onFinally()];
            case 11:
                _a.sent(); // cleanup
                return [2 /*return*/];
        }
    });
}); };
exports.retryOnError = retryOnError;
//# sourceMappingURL=spawn.js.map