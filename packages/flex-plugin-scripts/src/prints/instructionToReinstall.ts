import { logger } from 'flex-dev-utils';
import { printList } from 'flex-dev-utils/dist/prints';

export default (...extras: string[]) => {
  const nameColor = logger.coloredStrings.name;
  const headline = logger.coloredStrings.headline;

  logger.info(`Please follow the following steps to ${headline('fix')} this issue:`);
  const lines = [
    `Delete your ${nameColor('node_modules')} directory`,
    `Delete ${nameColor('package-lock.json')} and/or ${nameColor('yarn.lock')}`,
    ...extras,
    `Run ${nameColor('npm install')} or ${nameColor('yarn install')} again`,
  ];

  printList(...lines);
};
