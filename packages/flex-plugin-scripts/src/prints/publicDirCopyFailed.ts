import { logger } from 'flex-dev-utils';
import instructionToReinstall from './instructionToReinstall';
import preFlightByPass from './preFlightByPass';

/**
 * Error message if we fail to sync the public/ directory
 *
 * @param err   the error message
 * @param skip  whether pre flight skip flag is set
 */
export default (err: Error, skip: boolean) => {
  const link = logger.coloredStrings.link;
  const scriptName = logger.coloredStrings.name('flex-plugin-scripts');

  logger.newline();

  logger.newline();
  logger.error('There might be a problem with your project file hierarchy.');
  logger.newline();

  logger.info(`The ${scriptName} failed to copy ${link('index.html')} into ${link('public/')} directory.`);
  logger.newline();

  instructionToReinstall();
  preFlightByPass(skip);

  logger.newline();
};
