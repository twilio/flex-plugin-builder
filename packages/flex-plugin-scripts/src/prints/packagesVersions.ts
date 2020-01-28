import { logger } from 'flex-dev-utils';

import { PackageDetail } from '../utils/package';
import instructionToReinstall from './instructionToReinstall';

export default (foundPackages: PackageDetail[], notFoundPackages: PackageDetail[]) => {
  const headline = logger.coloredStrings.headline;

  logger.info('Your plugin has the following packages installed:');
  logger.newline();
  foundPackages
    .forEach((detail) => {
      logger.info(`\t ${headline(`"${detail.name}": "${detail.package.version}"`)}`);
    });

  if (notFoundPackages.length) {
    logger.newline();
    logger.error('However, some required packages were not found:');
    logger.newline();
    notFoundPackages
      .forEach((detail) => {
        logger.info(`\t ${headline(`"${detail.name}"`)}`);
      });
    logger.newline();

    instructionToReinstall();
  }
};
