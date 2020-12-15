/* eslint-disable import/no-unused-modules */
import { checkForUpdate } from 'flex-dev-utils/dist/updateNotifier';

checkForUpdate();

export { default } from './lib/cli';
export { default as CreateFlexPlugin } from './lib/create-flex-plugin';
