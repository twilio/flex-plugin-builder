import { Logger } from '@twilio/flex-dev-utils';

/**
 * Successful release
 */
const releaseSuccessful = (logger: Logger) => (configurationSid: string) => {
  logger.newline();
  logger.success(`🚀 Configuration **${configurationSid}** was successfully enabled.`);
  logger.newline();

  logger.info('**Next Steps:**');
  logger.info('Visit https://flex.twilio.com/admin/plugins to see your plugin(s) live on Flex.');
  logger.newline();
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => ({
  releaseSuccessful: releaseSuccessful(logger),
});
