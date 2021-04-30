"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
/**
 * Successful message to print after a deploy
 *
 * @param url       the Asset URL
 * @param isPublic  whether the Asset is uploaded publicly or privately
 * @param account   the account doing the deploy
 */
exports.default = (function (url, isPublic, account) {
    var availability = isPublic ? 'publicly' : 'privately';
    var nameLogger = flex_dev_utils_1.logger.coloredStrings.name;
    var friendlyName = account.friendly_name || account.sid;
    var accountSid = (friendlyName !== account.sid && " (" + nameLogger(account.sid) + ")") || '';
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.success(strings_1.singleLineString('🚀  Your plugin has been successfully deployed to your Flex project', "" + nameLogger(friendlyName) + accountSid + ".", "It is hosted (" + availability + ") as a Twilio Asset on " + flex_dev_utils_1.logger.coloredStrings.link(url) + "."));
    flex_dev_utils_1.logger.newline();
});
//# sourceMappingURL=deploySuccessful.js.map