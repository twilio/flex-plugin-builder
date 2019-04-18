import chalk from 'chalk';
import * as wrapAnsi from 'wrap-ansi';
import * as symbols from 'log-symbols';
import { multilineString } from './strings';
import * as boxen from 'boxen';
import {FlexPluginArguments} from '../lib/create-flex-plugin';

const ERROR = chalk.bold('ERROR');
const headline = chalk.bold.green;

export const error = (message: string, ...args: string[]) => {
 console.error(`${symbols.error} ${ERROR} ${message}`, ...args);
};

export const finalMessage = (config: FlexPluginArguments) => {
  const tool = config.yarn ? 'yarn' : 'npm';

  const installCommand = config.yarn ? 'yarn' : 'npm install';
  const setupMessage = multilineString(
    `${headline('Setup:')}`,
    `$ cd ${config.name}/`,
    `$ ${installCommand}`
  );

  const startCommand = `${tool} start`;
    const devMessage = multilineString(
    `${headline('Development:')}`,
    `$ cd ${config.name}/`,
    `$ ${startCommand}`
  );

  const buildCommand = config.yarn ? 'yarn build' : 'npm run build';
  const buildMessage = multilineString(
    `${headline('Build Command:')}`,
    `$ cd ${config.name}/`,
    `$ ${buildCommand}`,
  );

  let message = multilineString(
    `Your Twilio Flex plugin project has been successfully created!`,
    `${config.install ? '' : `\n\n ${setupMessage}`}\n`,
    `${devMessage}\n`,
    `${buildMessage}\n`,
    'For more info check the README.md file or go to:',
    '➡ https://www.twilio.com/docs/flex'
  );

  console.log(wrapAnsi);

  const columns = (process.stdout.columns || 100) - 14 /* boxen spacing */;
  message = wrapAnsi(message, columns, { hard: true });

  const boxedMessage = boxen(message, {
    padding: 1,
    margin: 1,
  });
  console.log(boxedMessage);
};
