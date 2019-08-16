import { logger } from 'flex-dev-utils';

import instructionToReinstall from './instructionToReinstall';

export default (packageName: string) => {
  const nameColor = logger.coloredStrings.name;
  const flexUIName = nameColor('@twilio/flex-ui');

  logger.newline();
  logger.error('An expected package was not found.');
  logger.newline();

  logger.info(`Expected package ${nameColor(packageName)} was not found in ${flexUIName}.`);
  logger.newline();

  instructionToReinstall();
};
