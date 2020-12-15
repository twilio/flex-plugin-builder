import updateNotifier from 'update-notifier';

import { readPackageJson, findUp, readAppPackageJson } from './fs';

export default updateNotifier;

/**
 * Checks for update for the package
 */
/* istanbul ignore next */
export const checkForUpdate = () => {
  const pkg = module.parent ? readPackageJson(findUp(module.parent.filename, 'package.json')) : readAppPackageJson();

  updateNotifier({ pkg }).notify();
};
