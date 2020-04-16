import { logger } from 'flex-dev-utils';

/**
 * Prints an error if typescript module is not installed
 */
export default () => {
  const bold = logger.colors.bold('jest');
  logger.error('It looks like you\'re trying to use Plugin but do not have the %s package installed.', bold);
  logger.info('Please install %s by running:', bold);
  logger.installInfo('npm', 'install jest --save-dev');
  logger.newline();
}
