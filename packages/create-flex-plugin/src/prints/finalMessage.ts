import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import { info as boxedInfo } from 'flex-dev-utils/dist/boxen';
import { multilineString } from 'flex-dev-utils/dist/strings';

import { FlexPluginArguments } from '../lib/create-flex-plugin';

const headline = chalk.bold.green;

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

  let message = multilineString(
    `Your Twilio Flex Plugin project has been successfully created!`,
    `${config.install ? '' : `\n\n ${setupMessage}`}\n`,
    `${devMessage}\n`,
    `${buildMessage}\n`,
    'For more info check the README.md file or go to:',
    '➡ https://www.twilio.com/docs/flex',
  );

  const columns = (process.stdout.columns || 100) - 14;
  message = wrapAnsi(message, columns, { hard: true });

  boxedInfo(message, false);
};
