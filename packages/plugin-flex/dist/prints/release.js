"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Successful release
 */
const releaseSuccessful = (logger) => (configurationSid) => {
    logger.newline();
    logger.success(`🚀 Configuration **${configurationSid}** was successfully enabled.`);
    logger.newline();
    logger.info('**Next Steps:**');
    logger.info('Visit https://flex.twilio.com/admin/plugins to see your plugin(s) live on Flex.');
    logger.newline();
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (logger) => ({
    releaseSuccessful: releaseSuccessful(logger),
});
//# sourceMappingURL=release.js.map