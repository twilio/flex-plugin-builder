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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSanitizedProcessEnv = exports._filterVariables = exports._readEnvFile = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = require("flex-dev-utils/dist/fs");
var flex_dev_utils_1 = require("flex-dev-utils");
var prints_1 = require("../prints");
var REACT_APP_REGEX = /^REACT_APP_/i;
var FLEX_APP_REGEX = /^FLEX_APP_/i;
/**
 * Checks whether the variable is of correct format
 * @param key
 */
var isValid = function (key) { return FLEX_APP_REGEX.test(key) || REACT_APP_REGEX.test(key); };
/**
 * Reads the .env file and process it. It will print warning messages if the format is invalid
 * @param filename  the filename to read
 * @param path      the path to the file
 */
var _readEnvFile = function (filename, path) {
    var newVars = dotenv_1.default.parse(fs_1.readFileSync(path));
    Object.keys(newVars)
        .filter(function (key) { return !isValid(key); })
        .forEach(function (key) { return prints_1.dotEnvIncorrectVariable(filename, key); });
    return newVars;
};
exports._readEnvFile = _readEnvFile;
/**
 * Filters and sanitizes the variables
 * @param variables the variables to read
 */
var _filterVariables = function (variables) {
    return Object.keys(variables)
        .filter(isValid)
        .reduce(function (newEnvs, key) {
        newEnvs[key] = JSON.stringify(variables[key]);
        return newEnvs;
    }, {});
};
exports._filterVariables = _filterVariables;
/**
 * Reads the .env files and sanitizes and only returns allowed keys
 */
var getSanitizedProcessEnv = function () {
    var _a = fs_1.getPaths(), appPaths = _a.app, cwd = _a.cwd;
    var variables = process.env;
    // Support .env file if provided
    if (appPaths.hasEnvFile()) {
        variables = __assign(__assign({}, variables), exports._readEnvFile('.env', appPaths.envPath));
    }
    // Support for profile specific .env file (this should come after .env to allow overwrite)
    if (flex_dev_utils_1.env.getTwilioProfile()) {
        var filename = "." + flex_dev_utils_1.env.getTwilioProfile() + ".env";
        var profileEnvPath = fs_1.resolveRelative(cwd, "/" + filename);
        if (fs_1.checkAFileExists(profileEnvPath)) {
            variables = __assign(__assign({}, variables), exports._readEnvFile(filename, profileEnvPath));
        }
    }
    return {
        'process.env': exports._filterVariables(variables),
    };
};
exports.getSanitizedProcessEnv = getSanitizedProcessEnv;
//# sourceMappingURL=clientVariables.js.map