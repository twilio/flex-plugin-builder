"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGitHubUrl = exports.isGitHubUrl = exports.isValidUrl = exports.validateApiKey = exports.validateAccountSid = exports.isInputNotEmpty = void 0;
var sids_1 = require("./sids");
var URL_REGEX = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
var GITHUB_REGEX = /github\.com/;
/**
 * Simple input validator to verify it is not empty
 *
 * @param input the input to validate
 */
var isInputNotEmpty = function (input) { return Boolean(input && input.length > 0); };
exports.isInputNotEmpty = isInputNotEmpty;
/**
 * Validates that the accountSid is valid
 *
 * @param str the accountSid
 */
var validateAccountSid = function (str) {
    if (!exports.isInputNotEmpty(str)) {
        return false;
    }
    if (!sids_1.isSidOfType(str, sids_1.SidPrefix.AccountSid)) {
        return 'Invalid Account Sid was provided';
    }
    return true;
};
exports.validateAccountSid = validateAccountSid;
/**
 * Validates that the apiKey is valid
 *
 * @param str the apiKey
 */
var validateApiKey = function (str) {
    if (!exports.isInputNotEmpty(str)) {
        return false;
    }
    if (!sids_1.isSidOfType(str, sids_1.SidPrefix.ApiKey)) {
        return 'Invalid Account Sid was provided';
    }
    return true;
};
exports.validateApiKey = validateApiKey;
/**
 * Validates the string is valid URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is valid
 * @private
 */
var isValidUrl = function (url) { return URL_REGEX.test(url); };
exports.isValidUrl = isValidUrl;
/**
 * Validates the string is a GitHub URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is GitHub
 * @private
 */
var isGitHubUrl = function (url) { return GITHUB_REGEX.test(url); };
exports.isGitHubUrl = isGitHubUrl;
/**
 * Validates that the URL is a GitHub URL
 *
 * @param url the URL to validate
 */
var validateGitHubUrl = function (url) {
    if (!exports.isValidUrl(url)) {
        return 'Please enter a valid URL';
    }
    if (!exports.isGitHubUrl(url)) {
        return 'Only GitHub URLs are currently supported';
    }
    return true;
};
exports.validateGitHubUrl = validateGitHubUrl;
exports.default = {};
//# sourceMappingURL=validators.js.map