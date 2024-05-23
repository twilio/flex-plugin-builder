import updateNotifier, { NotifyOptions, Settings } from 'update-notifier';

import { readPackageJson, findUp, readAppPackageJson } from './fs';
import { chalk } from '.';

export default updateNotifier;

/**
 * Checks for update for the package
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
export const checkForUpdate = (settings: Partial<Settings> = {}, customMessage: Partial<NotifyOptions> = {}): void => {
  const pkg = module.parent ? readPackageJson(findUp(module.parent.filename, 'package.json')) : readAppPackageJson();

  const notifier = updateNotifier({ pkg, updateCheckInterval: 1000, ...settings });

  const message = `Update available ${chalk.dim(notifier.update?.current)}${chalk.reset(' → ')}${chalk.green(
    notifier.update?.latest,
  )} \nRun ${chalk.cyan('twilio plugins:install @twilio-labs/plugin-flex')} to update`;

  notifier.notify({ message, ...customMessage });
};
