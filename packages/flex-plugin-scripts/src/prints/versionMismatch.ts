import { logger, env } from 'flex-dev-utils';
import { singleLineString } from 'flex-dev-utils/dist/strings';

import instructionToReinstall from './instructionToReinstall';
import preFlightByPass from './preFlightByPass';

/**
 * Logs a warning that a package version mismatches what Flex-UI requires
 *
 * @param packageName       the package that has the mismatch
 * @param installedVersion  the installed version
 * @param requiredVersion   the required version
 * @param skip              whether the developer is opting to skip
 */
export default (packageName: string, installedVersion: string, requiredVersion: string, skip: boolean): void => {
  const nameColor = logger.coloredStrings.name;
  const { headline } = logger.coloredStrings;
  const { red } = logger.colors;

  const flexUIName = nameColor('@twilio/flex-ui');
  const scriptName = nameColor('flex-plugin-scripts');

  env.setQuiet(false);
  logger.newline();
  logger.error(singleLineString('There might be a problem with your project dependency tree.'));
  logger.newline();

  logger.info(`The ${flexUIName} requires the following package:`);
  logger.newline();
  logger.info(`\t ${headline(`"${packageName}": "${requiredVersion}"`)}`);
  logger.newline();

  const versionPrint = red(installedVersion);
  logger.info(`However, a different version of this package was detected: ${versionPrint}.`);
  logger.info(`Do not try to install this manually; ${scriptName} manages that for you.`);
  logger.info('Managing this package yourself is known to cause issues in production environments.');
  logger.newline();

  instructionToReinstall(`Remove ${nameColor(packageName)} from your ${nameColor('package.json')} file`);

  preFlightByPass(skip);
  logger.newline();
  env.setQuiet(true);
};
