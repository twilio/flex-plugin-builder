import updateNotifier from 'update-notifier';
import { readPackageJson } from "./fs";

export default updateNotifier;

export const notify = () => {
  const pkg = readPackageJson();

  updateNotifier({pkg}).notify();
};
