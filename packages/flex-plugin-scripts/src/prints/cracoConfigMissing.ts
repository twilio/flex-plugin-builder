import { logger } from 'flex-dev-utils';

/**
 * Error about cracoConfig.js missing
 */
export default () => {
  const nameColor = logger.coloredStrings.name;
  const headline = logger.coloredStrings.headline;

  const scriptName = nameColor('flex-plugin-scripts');

  logger.newline();
  logger.error('There might be a problem with your project file hierarchy.');
  logger.newline();

  logger.info(`The ${scriptName} requires the following file to be present:`);
  logger.newline();
  logger.info(`\t ${headline('craco.config.js')}`);
  logger.newline();

  logger.newline();
};
