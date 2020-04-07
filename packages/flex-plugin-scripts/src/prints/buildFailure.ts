import { logger } from 'flex-dev-utils';
import paths from '../utils/paths';

const GITHUB_FEATURE_REQUEST = 'https://bit.ly/2UMdbbj';

const logError = (error: string) => {
  logger.info(error);

  if (error.indexOf('You may need an appropriate loader') !== -1) {
    const link = logger.coloredStrings.link(GITHUB_FEATURE_REQUEST);
    logger.newline();
    logger.notice(`You may file a feature request on GitHub (${link}) so we can add this loader.`);
  }
};

export default (errors: any[]) => {
  errors = errors || [];
  if (!errors.length) {
    errors = [errors];
  }

  const pkgName = logger.colors.red.bold(paths.packageName);
  logger.error(`Failed to compile plugin ${pkgName}.`);
  logger.newline();

  errors.forEach((error, index) => {
    const title = logger.colors.bold(`Error ${index + 1}`);
    logger.info(`${title}:`);
    if (typeof error === 'string') {
      logError(error);
    }
    if (typeof error === 'object') {
      logError(error.message);
    }

    logger.newline();
  });
}
