import updateNotifier, { NotifyOptions, Settings } from 'update-notifier';
import packageJson from 'package-json';

import { readPackageJson, findUp, readAppPackageJson } from './fs';
import { chalk } from '.';

export default updateNotifier;

/**
 * Checks for update for the package
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
export const checkForUpdate = async (
  settings: Partial<Settings> = {},
  customMessage: Partial<NotifyOptions> = {},
): Promise<void> => {
  const pkg = module.parent ? readPackageJson(findUp(module.parent.filename, 'package.json')) : readAppPackageJson();
  const pkgInfo = await packageJson(pkg.name, { version: pkg.version });
  const notifier = updateNotifier({ pkg, updateCheckInterval: 1000, ...settings });

  const message = `${
    pkgInfo.deprecated
      ? `${chalk.bgYellow.bold('You are currently using a deprecated version of Flex Plugin CLI')}\n\n`
      : ''
  }Update available ${chalk.dim(notifier.update?.current)}${chalk.reset(' → ')}${chalk.green(
    notifier.update?.latest,
  )} \nRun ${chalk.cyan('twilio plugins:install @twilio-labs/plugin-flex')} to update`;

  notifier.notify({ message, ...customMessage });
};
