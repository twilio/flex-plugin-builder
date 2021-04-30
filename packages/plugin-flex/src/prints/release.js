"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Successful release
 */
var releaseSuccessful = function (logger) { return function (configurationSid) {
    logger.newline();
    logger.success("\uD83D\uDE80 Configuration **" + configurationSid + "** was successfully enabled.");
    logger.newline();
    logger.info('**Next Steps:**');
    logger.info('Visit https://flex.twilio.com/admin/plugins to see your plugin(s) live on Flex.');
    logger.newline();
}; };
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (function (logger) { return ({
    releaseSuccessful: releaseSuccessful(logger),
}); });
//# sourceMappingURL=release.js.map