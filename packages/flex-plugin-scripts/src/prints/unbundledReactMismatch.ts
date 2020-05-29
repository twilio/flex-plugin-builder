import { logger } from 'flex-dev-utils';
import { singleLineString } from 'flex-dev-utils';
import preFlightByPass from './preFlightByPass';

/**
 * Prints instruction about unpinned react
 *
 * @param flexUIVersion   the installed version of flex-ui
 * @param packageName     the package that has the mismatch
 * @param version         the installed version
 * @param skip            whether the developer is opting to skip
 */
export default (flexUIVersion: string, packageName: string, version: string, skip: boolean) => {
  const nameColor = logger.coloredStrings.name;
  const headline = logger.coloredStrings.headline;

  const flexUIName = nameColor('@twilio/flex-ui');
  const minFlexUIVersion = nameColor('1.19.0');

  logger.newline();
  logger.error('There might be a problem with your project dependency tree.');
  logger.newline();

  logger.info('You are attempting to use the following package:');
  logger.newline();
  logger.info(`\t ${headline(`"${packageName}": "${version}"`)}`);
  logger.newline();

  logger.info(singleLineString(
    `However, unbundled React is only supported with ${flexUIName} version higher than `,
    `${minFlexUIVersion}. You are currently running:`,
  )) ;
  logger.newline();
  logger.info(`\t ${headline(`"@twilio/flex-ui": "${flexUIVersion}"`)}`);
  logger.newline();

  logger.info(`To fix this issue, install ${flexUIName} >= ${minFlexUIVersion}`);
  logger.newline();

  preFlightByPass(skip);
  logger.newline();
}
