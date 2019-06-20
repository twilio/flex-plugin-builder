import updateNotifier from 'update-notifier';
import { readPackageJson, findUp } from './fs';

export default updateNotifier;

export const checkForUpdate = () => {
  const pkg = module.parent
    ? readPackageJson(findUp(module.parent.filename, 'package.json'))
    : readPackageJson();

  updateNotifier({pkg}).notify();
};
