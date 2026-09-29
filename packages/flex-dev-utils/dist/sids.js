"use strict";
/* eslint-disable import/no-unused-modules */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidPrefix = exports.isSidOfType = exports.looksLikeSid = exports.isValidSid = void 0;
var SID_REGEX = /^[A-Z]{2}[0-9A-Fa-c]{32}$/i;
/**
 * Validates the string is a valid sid
 *
 * @param sid the sid
 */
var isValidSid = function (sid) { return Boolean(sid && /^[A-Z]{2}[0-9a-f]{32}$/.test(sid)); };
exports.isValidSid = isValidSid;
/**
 * Checks if the provided string is of type Sid
 * @param sid the sid to check
 */
var looksLikeSid = function (sid) {
    return Boolean(sid && SID_REGEX.test(sid));
};
exports.looksLikeSid = looksLikeSid;
/**
 * Validates sid is of type prefix provided
 *
 * @param sid     the sid
 * @param prefix  the prefix of the sid
 */
var isSidOfType = function (sid, prefix) {
    return Boolean(sid && prefix && exports.isValidSid(sid) && prefix.toUpperCase() === sid.substr(0, 2));
};
exports.isSidOfType = isSidOfType;
/**
 * Prefix of Sids
 */
exports.SidPrefix = {
    AccountSid: 'AC',
    ApiKey: 'SK',
    ServiceSid: 'ZS',
    EnvironmentSid: 'ZE',
    BuildSid: 'ZB',
    FileSid: 'ZH',
    VersionSid: 'ZN',
    DeploymentSid: 'ZD',
};
exports.default = {
    isValidSid: exports.isValidSid,
    isSidOfType: exports.isSidOfType,
    looksLikeSid: exports.looksLikeSid,
    SidPrefix: exports.SidPrefix,
};
//# sourceMappingURL=sids.js.map