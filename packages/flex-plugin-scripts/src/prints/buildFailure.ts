import { logger, env } from 'flex-dev-utils';
import { getPaths } from 'flex-dev-utils/dist/fs';

const GITHUB_FEATURE_REQUEST = 'https://bit.ly/2UMdbbj';

/**
 * Logs the error line ; tries to parse and print useful information based on the error
 * @param error the error line
 */
const logError = (error: string): void => {
  logger.info(error);

  if (error.indexOf('You may need an appropriate loader') !== -1) {
    const link = logger.coloredStrings.link(GITHUB_FEATURE_REQUEST);
    logger.newline();
    logger.notice(`You may file a feature request on GitHub (${link}) so we can add this loader.`);
  }
};

/**
 * Prints the errors when a build has failed to compile
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (errors: any[]): void => {
  errors = errors || [];
  if (!errors.length) {
    errors = [errors];
  }

  env.setQuiet(false);
  const pkgName = logger.colors.red.bold(getPaths().app.name);

  if (env.isCLI()) {
    logger.newline();
    logger.newline();
  }
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
  env.setQuiet(true);
};
