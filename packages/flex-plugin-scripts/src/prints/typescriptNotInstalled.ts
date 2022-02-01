import { logger, env } from '@twilio/flex-dev-utils';

/**
 * Prints an error if typescript module is not installed
 */
export default (): void => {
  const bold = logger.colors.bold('typescript');

  env.setQuiet(false);
  logger.error("It looks like you're trying to use Typescript but do not have the %s package installed.", bold);
  logger.info('Please install %s by running:', bold);
  logger.installInfo('npm', 'install typescript --save-dev');
  logger.newline();
  env.setQuiet(true);
};
