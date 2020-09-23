import { Logger, singleLineString } from 'flex-plugins-utils-logger';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';
import dayjs from 'dayjs';

import { createConfiguration as createConfigurationDocs } from '../commandDocs.json';

/**
 * Prints the successful message of a plugin deployment
 */
export const deploySuccessful = (logger: Logger) => (
  name: string,
  availability: string,
  deployedData: DeployResult,
) => {
  const defaultName = dayjs().format('MMM D, YYYY');

  logger.newline();
  logger.success(
    `🚀 Plugin (${availability}) **${name}**@**${deployedData.nextVersion}** was successfully deployed using Plugins API`,
  );
  logger.newline();

  // update this description
  logger.info('**Next Steps:**');
  logger.info(
    singleLineString(
      'Run {{$ twilio flex:plugins:release',
      `\\-\\-plugin ${name}@${deployedData.nextVersion}`,
      `\\-\\-name "${defaultName}"`,
      `\\-\\-description "${createConfigurationDocs.defaults.description}"}}`,
      'to enable this plugin on your flex instance',
    ),
  );
  logger.newline();
};

export default (logger: Logger) => ({
  deploySuccessful: deploySuccessful(logger),
});
