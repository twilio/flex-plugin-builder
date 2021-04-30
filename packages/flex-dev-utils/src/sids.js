"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidPrefix = exports.isSidOfType = exports.isValidSid = void 0;
/**
 * Validates the string is a valid sid
 *
 * @param sid the sid
 */
var isValidSid = function (sid) { return Boolean(sid && /^[A-Z]{2}[0-9a-f]{32}$/.test(sid)); };
exports.isValidSid = isValidSid;
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
    SidPrefix: exports.SidPrefix,
};
//# sourceMappingURL=sids.js.map