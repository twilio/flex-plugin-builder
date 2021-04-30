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
exports._combineFlags = exports._prepareFlags = exports._validate = exports._trim = void 0;
var errors_1 = require("@oclif/parser/lib/errors");
/**
 * Trims the object
 * @param obj
 * @private
 */
var _trim = function (obj) {
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        }
    });
    return obj;
};
exports._trim = _trim;
/**
 * Validates the flags
 * @param flags
 * @param options
 * @param parse
 * @private
 */
var _validate = function (flags, options, parse) {
    Object.keys(flags).forEach(function (flag) {
        var option = options[flag];
        var input = flags[flag];
        var cliErrorOption = {
            parse: {
                input: option,
                output: parse,
            },
            message: '',
        };
        if (!option) {
            return;
        }
        if (input === '' && option.required) {
            cliErrorOption.message = "Flag --" + flag + "=" + input + " cannot be empty";
            throw new errors_1.CLIParseError(cliErrorOption);
        }
        if ('min' in option && typeof input === 'string' && input.length < option.min) {
            cliErrorOption.message = "Flag --" + flag + "=" + input + " must be at least " + option.min + " characters long";
            throw new errors_1.CLIParseError(cliErrorOption);
        }
        if ('max' in option && typeof input === 'string' && input.length > option.max) {
            cliErrorOption.message = "Flag --" + flag + "=" + input + " cannot be longer than " + option.max + " characters";
            throw new errors_1.CLIParseError(cliErrorOption);
        }
    });
};
exports._validate = _validate;
/**
 * Prepares the options for parsing
 * @param options
 */
var _prepareFlags = function (options) {
    if (!options) {
        return options;
    }
    // @ts-ignore
    Object.entries(options.flags).forEach(function (entry) {
        if (entry[1].alias) {
            // @ts-ignore
            options.flags[entry[1].alias] = __assign({}, entry[1]);
        }
    });
    return options;
};
exports._prepareFlags = _prepareFlags;
/**
 * Combines the alias flags
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var _combineFlags = function (parsed, options) {
    if (!options) {
        return parsed;
    }
    // @ts-ignore
    Object.entries(options.flags).forEach(function (entry) {
        var _a;
        /*
         * Append the 'alias' to the actual (non-alias) flag
         * That check is entry[0] !== entry[1].alias (i.e. the alias option and the flag name are not the same)
         */
        if (entry[1].alias && entry[0] !== entry[1].alias && parsed.flags[entry[1].alias]) {
            if (parsed.flags[entry[0]]) {
                (_a = parsed.flags[entry[0]]).push.apply(_a, __spreadArray([], __read(parsed.flags[entry[1].alias])));
            }
            else {
                parsed.flags[entry[0]] = __spreadArray([], __read(parsed.flags[entry[1].alias]));
            }
        }
    });
    // @ts-ignore
    Object.entries(options.flags).forEach(function (entry) {
        if (entry[1].alias && entry[0] === entry[1].alias) {
            delete parsed.flags[entry[0]];
        }
    });
    return parsed;
};
exports._combineFlags = _combineFlags;
/**
 * Extends the parsing of OClif by adding support for empty/min/max
 * @param OclifParser the original parser from the command
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var parser = function (OclifParser) { return function (options, argv) {
    if (argv === void 0) { argv = []; }
    var parsed = exports._combineFlags(OclifParser(exports._prepareFlags(options), argv), options);
    parsed.flags = exports._trim(parsed.flags);
    parsed.args = exports._trim(parsed.args);
    if (options && options.flags && parsed.flags) {
        exports._validate(parsed.flags, options.flags, parsed);
    }
    return parsed;
}; };
exports.default = parser;
//# sourceMappingURL=parser.js.map