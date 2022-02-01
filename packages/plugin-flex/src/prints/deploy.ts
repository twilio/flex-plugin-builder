import { Logger, singleLineString, boxen, coloredStrings } from '@twilio/flex-dev-utils';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';

import { getTopic } from '../utils';

/**
 * Prints the successful message of a plugin deployment
 */
const deploySuccessful =
  (logger: Logger) => (name: string, availability: string, deployedData: DeployResult, profile: string | null) => {
    const defaultName = `Autogenerated Release ${Date.now()}`;
    const topic = getTopic('flex:plugins:create-configuration');
    const argsArr = [
      `\\-\\-plugin ${name}@${deployedData.nextVersion}`,
      `\\-\\-name "${defaultName}"`,
      `\\-\\-description "${topic.defaults.description}"`,
    ];
    if (profile) {
      argsArr.push(`\\-\\-profile ${profile}`);
    }

    logger.newline();
    logger.success(
      `🚀 Plugin (${availability}) **${name}**@**${deployedData.nextVersion}** was successfully deployed using Plugins API`,
    );
    logger.newline();

    // update this description
    logger.info('**Next Steps:**');
    logger.info(
      singleLineString(
        `Run {{$ twilio flex:plugins:release `,
        `{{${argsArr.join(' ')}}}`,
        ' to enable this plugin on your Flex application',
      ),
    );
    logger.newline();
  };

/**
 * Warns about having legacy plugins
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const warnHasLegacy = (logger: Logger) => () => {
  const cmd = coloredStrings.code('$ twilio flex:plugins:upgrade-plugin --remove-legacy-plugin');
  boxen.warning(`You have a legacy bundle of this plugin. Remove it by running ${cmd}`);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => ({
  deploySuccessful: deploySuccessful(logger),
  warnHasLegacy: warnHasLegacy(logger),
});
