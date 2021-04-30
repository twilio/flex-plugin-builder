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
exports.logResult = void 0;
var child_process_1 = require("child_process");
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var __1 = require("..");
/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
exports.default = (function (cmd, args, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var defaultOptions = {
                    cwd: __1.homeDir,
                    env: {
                        PATH: process.env.PATH + ":/" + __1.homeDir + "/bin",
                        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
                        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
                    },
                };
                var spawnOptions = __assign(__assign({}, defaultOptions), options);
                flex_plugins_utils_logger_1.logger.info("Running spawn command: **" + cmd + " " + args.join(' ').replace(/-/g, '\\-') + "**");
                flex_plugins_utils_logger_1.logger.debug("Spawn options are **" + JSON.stringify(options) + "**");
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
                    if (typeof data === 'string') {
                        stderrArr.push(Buffer.from(data, 'utf-8'));
                    }
                    else {
                        stderrArr.push(data);
                    }
                });
                // data
                child.stdout.on('data', function (data) {
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
            })];
    });
}); });
/**
 * Helper for logging the result from a spawn
 * @param result the result to log
 */
var logResult = function (result) {
    flex_plugins_utils_logger_1.logger.info(result.stdout.replace(/-/g, '\\-'));
    if (result.stderr) {
        flex_plugins_utils_logger_1.logger.warning(result.stderr.replace(/-/g, '\\-'));
    }
};
exports.logResult = logResult;
//# sourceMappingURL=spawn.js.map