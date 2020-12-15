import { logger } from 'flex-dev-utils';

import instructionToReinstall from './instructionToReinstall';

/**
 * An expected dependency from flex-ui package.json is missing.
 *
 * @param packageName the package name
 */
export default (packageName: string): void => {
  const nameColor = logger.coloredStrings.name;
  const flexUIName = nameColor('@twilio/flex-ui');

  logger.newline();
  logger.error('An expected package was not found.');
  logger.newline();

  logger.info(`Expected package ${nameColor(packageName)} was not found in ${flexUIName}.`);
  logger.newline();

  instructionToReinstall();
};
