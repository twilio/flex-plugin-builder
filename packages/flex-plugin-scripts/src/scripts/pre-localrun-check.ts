import { logger } from '@twilio/flex-dev-utils';
import { checkRunPluginConfigurationExists } from '@twilio/flex-dev-utils/dist/fs';

import run from '../utils/run';

const preLocalRunCheck = async (...args: string[]): Promise<void> => {
  logger.debug('Checking users environment is ready to run plugins locally');

  // Slice the args to get rid of last two elements ('--core-cwd' and the 'cwd')
  await checkRunPluginConfigurationExists(args.slice(0, -2));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(preLocalRunCheck);

// eslint-disable-next-line import/no-unused-modules
export default preLocalRunCheck;
