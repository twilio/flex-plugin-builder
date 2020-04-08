import { logger } from 'flex-dev-utils';
import { Bundle } from '../scripts/build';
import paths from '../utils/paths';

/**
 * Prints the successful message when a build has successfully compiled
 */
export default (bundles: Bundle[], warnings?: string[]) => {
  if (warnings && warnings.length) {
    const pkgName = logger.colors.yellow.bold(paths.packageName);
    logger.error(`Plugin ${pkgName} was successfully compiled with some warnings.`);
    logger.newline();
    warnings.forEach((warning, index) => {
      const title = logger.colors.bold(`Warning ${index + 1}`);
      logger.info(title);
      logger.info(warning);
    });
  } else {
    const pkgName = logger.colors.green.bold(paths.packageName);
    logger.success(`Plugin ${pkgName} was successfully compiled.`);
  }
  logger.newline();

  logger.info(bundles.length, 'files were compiled:');
  bundles
    .forEach(bundle => {
      const size = Math.round((bundle.size / 1024) * 10) / 10;
      const path = `${logger.colors.gray('build')}/${bundle.name}`;
      logger.info('\t', size, 'KB', '\t', path);
    });

  // Build command invoked directly, and not as a predeploy script
  if (process.env.npm_lifecycle_event === 'build') {
    logger.newline();
    logger.info('Your', logger.colors.bold('plugin'), 'is now ready to be deployed.');
    logger.info('You can deploy it to Twilio using:');
    logger.newline();
    logger.info('\t', logger.colors.cyan('npm'), 'run deploy');
  }
}
