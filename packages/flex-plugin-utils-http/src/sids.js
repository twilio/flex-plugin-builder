"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.looksLikeSid = void 0;
var SID_REGEX = /^[A-Z]{2}[0-9A-Fa-c]{32}$/i;
/**
 * Checks if the provided string is of type Sid
 * @param sid the sid to check
 */
var looksLikeSid = function (sid) {
    return Boolean(sid && SID_REGEX.test(sid));
};
exports.looksLikeSid = looksLikeSid;
//# sourceMappingURL=sids.js.map