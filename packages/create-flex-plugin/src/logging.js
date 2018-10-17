import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import * as symbols from 'log-symbols';
import { stripIndent } from 'common-tags';
import boxen from 'boxen';

const ERROR = chalk.bold('ERROR');
const headline = chalk.bold.green;

export function error(message, ...args) {
  console.error(`${symbols.error} ${ERROR} ${message}`, ...args);
}

export function finalMessage(config) {
  const tool = config.yarn ? 'yarn' : 'npm';

  const installCommand = config.yarn ? 'yarn' : 'npm install';
  const setupMessage = stripIndent`
    ${headline('Setup:')}
      $ cd ${config.pluginFileName}/
      $ ${installCommand}
  `;

  const startCommand = `${tool} start`;
  const devMessage = stripIndent`
    ${headline('Development:')}
      $ cd ${config.pluginFileName}/
      $ ${startCommand}
  `;

  const buildCommand = config.yarn ? 'yarn build' : 'npm run build';
  const buildMessage = stripIndent`
    ${headline('Build Command:')}
      $ cd ${config.pluginFileName}/
      $ ${buildCommand}
  `;

  let message = stripIndent`
    Your Twilio Flex plugin project has been successfully created!${
      !config.install ? `\n\n  ${setupMessage}` : ''
    }
    
  ${devMessage}
    
  ${buildMessage}

  For more info check the README.md file or go to:
  ➡ https://www.twilio.com/docs/flex
  `;

  const columns = (process.stdout.columns || 100) - 14 /* boxen spacing */;
  message = wrapAnsi(message, columns, { hard: true });

  const boxedMessage = boxen(message, {
    padding: 1,
    margin: 1,
  });
  console.log(boxedMessage);
}
