import { env, logger } from '@twilio/flex-dev-utils';
import { Lifecycle } from '@twilio/flex-dev-utils/dist/env';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

import { Bundle } from '../scripts/build';

/**
 * Prints the successful message when a build has successfully compiled
 */
export default (bundles: Bundle[], warnings?: string[]): void => {
  if (warnings && warnings.length) {
    const pkgName = logger.colors.yellow.bold(getPaths().app.name);
    logger.error(`\nPlugin ${pkgName} was successfully compiled with some warnings.`);
    logger.newline();
    warnings.forEach((warning, index) => {
      const title = logger.colors.bold(`Warning ${index + 1}`);
      logger.info(title);
      logger.info(warning);
    });
  } else {
    const pkgName = logger.colors.green.bold(getPaths().app.name);
    logger.success(`Plugin ${pkgName} was successfully compiled.`);
  }
  logger.newline();

  logger.info(bundles.length, 'files were compiled:');
  bundles.forEach((bundle) => {
    const size = Math.round((bundle.size / 1024) * 10) / 10;
    const path = `${logger.colors.gray('build')}/${bundle.name}`;
    logger.info('\t', size, 'KB', '\t', path);
  });

  // Build command invoked directly, and not as a predeploy script
  if (env.isLifecycle(Lifecycle.Build)) {
    logger.newline();
    logger.info('Your', logger.colors.bold('plugin'), 'is now ready to be deployed.');
    logger.info('You can deploy it to Twilio using:');
    logger.newline();
    logger.installInfo('npm', 'run deploy');
  }
};
