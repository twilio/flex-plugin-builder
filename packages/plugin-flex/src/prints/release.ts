import { Logger } from 'flex-plugins-utils-logger';

/**
 * Successful release
 */
export const releaseSuccessful = (logger: Logger) => (configurationSid: string) => {
  logger.newline();
  logger.success(`🚀 Configuration **${configurationSid}** was successfully enabled.`);
  logger.newline();

  logger.info('**Next Steps:**');
  logger.info('Visit https://flex.twilio.com/admin/plugins to see your plugin(s) live on Flex.');
  logger.newline();
};

export default (logger: Logger) => ({
  releaseSuccessful: releaseSuccessful(logger),
});
