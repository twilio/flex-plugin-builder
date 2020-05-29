import { logger } from 'flex-dev-utils';
import { singleLineString } from 'flex-dev-utils';

const link = logger.coloredStrings.link;

/**
 * Error about appConfig.js missing
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
  logger.info(`\t ${headline('public/appConfig.js')}`);
  logger.newline();

  logger.info(singleLineString(
    `Check your ${link('public/')} directory for ${link('appConfig.example.js')},`,
    `copy it to ${link('appConfig.js')}, and modify your Account Sid and Service URL.`,
  ));

  logger.newline();
};
