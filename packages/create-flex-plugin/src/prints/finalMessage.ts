import { logger, boxen, multilineString } from 'flex-dev-utils';

import { FlexPluginArguments } from '../lib/create-flex-plugin';

const headline = logger.coloredStrings.headline;

/**
 * Prints the final message after the successful creation of a new project
 * @param config
 */
export default (config: FlexPluginArguments) => {
  const tool = config.yarn ? 'yarn' : 'npm';

  const installCommand = config.yarn ? 'yarn' : 'npm install';
  const setupMessage = multilineString(
    `${headline('Setup:')}`,
    `$ cd ${config.name}/`,
    `$ ${installCommand}`,
  );

  const startCommand = `${tool} start`;
  const devMessage = multilineString(
    `${headline('Development:')}`,
    `$ cd ${config.name}/`,
    `$ ${startCommand}`,
  );

  const buildCommand = config.yarn ? 'yarn build' : 'npm run build';
  const buildMessage = multilineString(
    `${headline('Build Command:')}`,
    `$ cd ${config.name}/`,
    `$ ${buildCommand}`,
  );

  const deployCommand = config.yarn ? 'yarn deploy' : 'npm run deploy';
  const deployMessage = multilineString(
    `${headline('Deploy Command:')}`,
    `$ cd ${config.name}/`,
    `$ ${deployCommand}`,
  );

  let message = multilineString(
    `Your Twilio Flex Plugin project has been successfully created!`,
    `${config.install ? '' : `\n\n ${setupMessage}`}\n`,
    `${devMessage}\n`,
    `${buildMessage}\n`,
    `${deployMessage}\n`,
    'For more info check the README.md file or go to:',
    '➡ https://www.twilio.com/docs/flex',
  );

  const columns = (process.stdout.columns || 100) - 14;
  message = logger.wrap(message, columns, { hard: true });

  boxen.info(message, false);
};
