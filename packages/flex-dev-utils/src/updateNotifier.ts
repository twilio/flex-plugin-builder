import updateNotifier, { NotifyOptions } from 'update-notifier';

import { readPackageJson, findUp, readAppPackageJson } from './fs';

export default updateNotifier;

/**
 * Checks for update for the package
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
export const checkForUpdate = (customMessage?: NotifyOptions): void => {
  const pkg = module.parent ? readPackageJson(findUp(module.parent.filename, 'package.json')) : readAppPackageJson();

  updateNotifier({ pkg }).notify(customMessage);
};
