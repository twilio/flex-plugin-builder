"use strict";
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
exports._logger = exports.Logger = exports.coloredStrings = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any, prefer-named-capture-group */
var util_1 = require("util");
var chalk_1 = __importDefault(require("chalk"));
var wrap_ansi_1 = __importDefault(require("wrap-ansi"));
var pipe_compose_1 = require("@k88/pipe-compose");
var flex_plugins_utils_env_1 = __importDefault(require("flex-plugins-utils-env"));
var string_width_1 = __importDefault(require("string-width"));
var columnify_1 = __importDefault(require("./columnify"));
// The default option for wrap-ansi
var DefaultWrapOptions = { hard: true };
exports.coloredStrings = {
    dim: chalk_1.default.dim,
    bold: chalk_1.default.bold,
    italic: chalk_1.default.italic,
    code: chalk_1.default.magenta,
    link: chalk_1.default.cyan,
    info: chalk_1.default.blue,
    success: chalk_1.default.green,
    warning: chalk_1.default.yellow,
    error: chalk_1.default.red,
    headline: chalk_1.default.bold.green,
    name: chalk_1.default.bold.magenta,
    digit: chalk_1.default.magenta,
};
/**
 * The Logger class
 */
var Logger = /** @class */ (function () {
    function Logger(options) {
        var _this = this;
        /**
         * debug level log
         * @param args
         */
        this.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.isDebug()) {
                _this._log({ level: 'info', args: args });
            }
        };
        /**
         * trace level trace
         * @param args
         */
        this.trace = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.isTrace()) {
                _this._log({ level: 'info', args: args });
            }
        };
        /**
         * info level log
         * @param args
         */
        this.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._log({ level: 'info', args: args });
        };
        /**
         * success level log
         * @param args
         */
        this.success = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._log({ level: 'info', color: 'green', args: args });
        };
        /**
         * error level log
         * @param args
         */
        this.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._log({ level: 'error', color: 'red', args: args });
        };
        /**
         * warning level log
         * @param args
         */
        this.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._log({ level: 'warn', color: 'yellow', args: args });
        };
        /**
         * Notice log is info level with a magenta color
         * @param args
         */
        this.notice = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._log({ level: 'info', color: 'magenta', args: args });
        };
        /**
         * Simple wrapper for column printing
         * @param lines
         * @param options
         */
        this.columns = function (lines, options) {
            var minWidths = Array(lines[0].length).fill(0);
            lines.forEach(function (line) {
                line.forEach(function (entry, index) {
                    minWidths[index] = Math.max(minWidths[index], string_width_1.default(entry));
                });
            });
            // Convert array to object
            var data = lines.map(function (line) {
                return line.reduce(function (accum, entry, index) {
                    accum["entry" + index] = entry;
                    return accum;
                }, {});
            });
            // create the configuration
            var config = minWidths.reduce(function (accum, minWidth, index) {
                if (index < minWidths.length - 1) {
                    minWidth += 5;
                }
                accum["entry" + index] = { minWidth: minWidth };
                return accum;
            }, {});
            var cols = columnify_1.default(data, { showHeaders: false, config: config });
            if (options === null || options === void 0 ? void 0 : options.indent) {
                cols = cols
                    .split('\n')
                    .map(function (entry) { return "\t" + entry; })
                    .join('\n');
            }
            _this._log({ level: 'info', args: [cols] });
        };
        /**
         * Appends new line
         * @param lines the number of lines to append
         */
        this.newline = function (lines) {
            if (lines === void 0) { lines = 1; }
            for (var i = 0; i < lines; i++) {
                _this.info();
            }
        };
        /**
         * A wrapper for showing bash command information such as `npm install foo`
         * @param command the bash command
         * @param args  the remaining arguments
         */
        this.installInfo = function (command) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _this.info.apply(_this, __spreadArray(['\t', chalk_1.default.cyan(command)], __read(args)));
        };
        /**
         * Clears the terminal either if forced is provided, or if persist_terminal env is not set
         */
        /* istanbul ignore next */
        this.clearTerminal = function (forced) {
            if (forced === void 0) { forced = false; }
            if (forced || !flex_plugins_utils_env_1.default.isTerminalPersisted()) {
                process.stdout.write(flex_plugins_utils_env_1.default.isWin32() ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
            }
        };
        /**
         * Provides basic markdown support. Currently supported bold **bold** and italic *italic*
         * @param msg
         */
        this.markdown = function (msg) {
            if (!msg || msg === '') {
                return msg;
            }
            for (var key in Logger.formatter) {
                if (Logger.formatter.hasOwnProperty(key)) {
                    var formatter = Logger.formatter[key];
                    var regex = new RegExp(formatter.openChars + "(.*?)" + formatter.closeChars);
                    var match = msg.match(regex);
                    if (match) {
                        var replace = match[0]
                            .replace(new RegExp(formatter.openChars, 'g'), '')
                            .replace(new RegExp(formatter.closeChars, 'g'), '');
                        return _this.markdown(msg.replace(regex, formatter.render(replace)));
                    }
                }
            }
            return msg.replace(/\\/g, '');
        };
        /**
         * The internal logger method
         * @param args
         * @private
         */
        this._log = function (args) {
            if (!_this.isQuiet() || args.level === 'error' || _this.isDebug()) {
                // eslint-disable-next-line no-console
                var log = console[args.level];
                var color = args.color ? chalk_1.default[args.color] : function (msg) { return msg; };
                var msg = util_1.format.apply({}, args.args);
                pipe_compose_1.pipe(msg, color, _this.markdown, log);
            }
        };
        /**
         * Checks whether the logger is set for debug mode
         */
        this.isDebug = function () {
            if ('isDebug' in _this.options) {
                return _this.options.isDebug || false;
            }
            return flex_plugins_utils_env_1.default.isDebug();
        };
        /**
         * Checks whether the logger is set for trace mode
         */
        this.isTrace = function () {
            if ('isTrace' in _this.options) {
                return _this.options.isTrace || false;
            }
            return flex_plugins_utils_env_1.default.isTrace();
        };
        this.isQuiet = function () {
            if ('isQuiet' in _this.options) {
                return _this.options.isQuiet || false;
            }
            return flex_plugins_utils_env_1.default.isQuiet();
        };
        this.options = options || {};
    }
    Logger.formatter = {
        dim: {
            openChars: '\\.{2}',
            closeChars: '\\.{2}',
            render: exports.coloredStrings.dim,
        },
        bold: {
            openChars: '\\*{2}',
            closeChars: '\\*{2}',
            render: exports.coloredStrings.bold,
        },
        italic: {
            openChars: '\\*',
            closeChars: '\\*',
            render: exports.coloredStrings.italic,
        },
        code: {
            openChars: '\\{{2}',
            closeChars: '\\}{2}',
            render: exports.coloredStrings.code,
        },
        link: {
            openChars: '\\[{2}',
            closeChars: '\\]{2}',
            render: exports.coloredStrings.link,
        },
        info: {
            openChars: '@{2}',
            closeChars: '@{2}',
            render: exports.coloredStrings.info,
        },
        success: {
            openChars: '\\+{2}',
            closeChars: '\\+{2}',
            render: exports.coloredStrings.success,
        },
        warning: {
            openChars: '\\!{2}',
            closeChars: '\\!{2}',
            render: exports.coloredStrings.warning,
        },
        error: {
            openChars: '\\-{2}',
            closeChars: '\\-{2}',
            render: exports.coloredStrings.error,
        },
    };
    return Logger;
}());
exports.Logger = Logger;
/**
 * Word wrapping using ANSI escape codes
 *
 * @param input     the string to wrap
 * @param columns   number of columns
 * @param options   options
 */
var wrap = function (input, columns, options) {
    if (options === void 0) { options = DefaultWrapOptions; }
    return wrap_ansi_1.default(input, columns, options);
};
/**
 * The default logger will use environment variables to determine behavior.
 * You can create an instance to overwrite default behavior.
 */
exports._logger = new Logger();
var debug = exports._logger.debug, info = exports._logger.info, warning = exports._logger.warning, error = exports._logger.error, trace = exports._logger.trace, success = exports._logger.success, newline = exports._logger.newline, notice = exports._logger.notice, installInfo = exports._logger.installInfo, clearTerminal = exports._logger.clearTerminal, markdown = exports._logger.markdown, columns = exports._logger.columns;
exports.default = {
    debug: debug,
    info: info,
    warning: warning,
    error: error,
    trace: trace,
    success: success,
    newline: newline,
    notice: notice,
    installInfo: installInfo,
    clearTerminal: clearTerminal,
    markdown: markdown,
    wrap: wrap,
    columns: columns,
    colors: chalk_1.default,
    coloredStrings: exports.coloredStrings,
};
//# sourceMappingURL=logger.js.map