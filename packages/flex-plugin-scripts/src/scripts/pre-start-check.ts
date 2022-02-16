import { existsSync } from 'fs';

import { logger, exit } from '@twilio/flex-dev-utils';
import { getPaths, addCWDNodeModule } from '@twilio/flex-dev-utils/dist/fs';

import { appConfigMissing } from '../prints';
import run from '../utils/run';
import { _setPluginDir } from './pre-script-check';

/**
 * Checks appConfig exists
 *
 * @private
 */
export const _checkAppConfig = (): void => {
  if (!existsSync(getPaths().app.appConfig)) {
    appConfigMissing();

    exit(1);
  }
};

/**
 * Runs pre-start/build checks
 */
const preScriptCheck = async (...args: string[]): Promise<void> => {
  logger.debug('Checking Flex plugin project directory');

  addCWDNodeModule(...args);

  _setPluginDir(...args);
  _checkAppConfig();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(preScriptCheck);

// eslint-disable-next-line import/no-unused-modules
export default preScriptCheck;
