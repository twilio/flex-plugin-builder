import { logger, env } from '@twilio/flex-dev-utils';

/**
 * Prints an error if jest module is not installed
 */
export default (): void => {
  const bold = logger.colors.bold('jest');

  env.setQuiet(false);
  logger.error("It looks like you're trying to use Jest but do not have the %s package installed.", bold);
  logger.info('Please install %s by running:', bold);
  logger.installInfo('npm', 'install jest --save-dev');
  logger.newline();
  env.setQuiet(true);
};
