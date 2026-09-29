"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._combineFlags = exports._prepareFlags = exports._validate = exports._sanitize = void 0;
const errors_1 = require("@oclif/parser/lib/errors");
/**
 * Sanitizes the object
 * @param obj
 * @private
 */
const _sanitize = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
            obj[key] = encodeURIComponent(obj[key].trim());
        }
    });
    return obj;
};
exports._sanitize = _sanitize;
/**
 * Validates the flags
 * @param flags
 * @param options
 * @param parse
 * @private
 */
const _validate = (flags, options, parse) => {
    Object.keys(flags).forEach((flag) => {
        const option = options[flag];
        const input = flags[flag];
        const cliErrorOption = {
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
            cliErrorOption.message = `Flag --${flag}=${input} cannot be empty`;
            throw new errors_1.CLIParseError(cliErrorOption);
        }
        if ('min' in option && typeof input === 'string' && input.length < option.min) {
            cliErrorOption.message = `Flag --${flag}=${input} must be at least ${option.min} characters long`;
            throw new errors_1.CLIParseError(cliErrorOption);
        }
        if ('max' in option && typeof input === 'string' && input.length > option.max) {
            cliErrorOption.message = `Flag --${flag}=${input} cannot be longer than ${option.max} characters`;
            throw new errors_1.CLIParseError(cliErrorOption);
        }
    });
};
exports._validate = _validate;
/**
 * Prepares the options for parsing
 * @param options
 */
const _prepareFlags = (options) => {
    if (!options) {
        return options;
    }
    // @ts-ignore
    Object.entries(options.flags).forEach((entry) => {
        if (entry[1].alias) {
            // @ts-ignore
            options.flags[entry[1].alias] = Object.assign({}, entry[1]);
        }
    });
    return options;
};
exports._prepareFlags = _prepareFlags;
/**
 * Combines the alias flags
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _combineFlags = (parsed, options) => {
    if (!options) {
        return parsed;
    }
    // @ts-ignore
    Object.entries(options.flags).forEach((entry) => {
        /*
         * Append the 'alias' to the actual (non-alias) flag
         * That check is entry[0] !== entry[1].alias (i.e. the alias option and the flag name are not the same)
         */
        if (entry[1].alias && entry[0] !== entry[1].alias && parsed.flags[entry[1].alias]) {
            if (parsed.flags[entry[0]]) {
                parsed.flags[entry[0]].push(...parsed.flags[entry[1].alias]);
            }
            else {
                parsed.flags[entry[0]] = [...parsed.flags[entry[1].alias]];
            }
        }
    });
    // @ts-ignore
    Object.entries(options.flags).forEach((entry) => {
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
/* c8 ignore next */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parser = (OclifParser) => async (options, argv = []) => {
    const preparedFlags = exports._prepareFlags(options);
    const parsed = exports._combineFlags(await OclifParser(preparedFlags, argv), options);
    parsed.flags = exports._sanitize(parsed.flags);
    parsed.args = exports._sanitize(parsed.args);
    if (options && options.flags && parsed.flags) {
        exports._validate(parsed.flags, options.flags, parsed);
    }
    return parsed;
};
exports.default = parser;
//# sourceMappingURL=parser.js.map