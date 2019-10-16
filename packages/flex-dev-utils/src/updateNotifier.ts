import updateNotifier from 'update-notifier';
import { readPackageJson, findUp } from './fs';

export default updateNotifier;

/**
 * Checks for update for the package
 */
/* istanbul ignore next */
export const checkForUpdate = () => {
  const pkg = module.parent
    ? readPackageJson(findUp(module.parent.filename, 'package.json'))
    : readPackageJson();

  updateNotifier({pkg}).notify();
};
