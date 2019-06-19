import { notify as updateNotify } from 'flex-dev-utils/dist/updateNotifier';

// Check for update
updateNotify();

export { default } from './lib/cli';
export { default as CreateFlexPlugin } from './lib/create-flex-plugin';
