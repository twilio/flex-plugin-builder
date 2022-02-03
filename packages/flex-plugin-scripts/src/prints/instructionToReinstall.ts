import { logger, env } from '@twilio/flex-dev-utils';
import { printList } from '@twilio/flex-dev-utils/dist/prints';

/**
 * Instructions for removing node_modules and lock files and re-installing
 *
 * @param extras  any extra steps to include
 */
export default (...extras: string[]): void => {
  const nameColor = logger.coloredStrings.name;
  const { headline } = logger.coloredStrings;

  env.setQuiet(false);
  logger.info(`Please follow these steps to possibly ${headline('fix')} this issue:`);
  const lines = [
    `Delete your ${nameColor('node_modules')} directory`,
    `Delete ${nameColor('package-lock.json')} and/or ${nameColor('yarn.lock')}`,
    ...extras,
    `Run ${nameColor('npm install')} or ${nameColor('yarn install')} again`,
  ];

  printList(...lines);
  env.setQuiet(true);
};
