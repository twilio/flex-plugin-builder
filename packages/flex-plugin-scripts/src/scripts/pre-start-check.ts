import { logger } from 'flex-dev-utils';
import {
  getPaths,
  addCWDNodeModule,
} from 'flex-dev-utils/dist/fs';
import { existsSync } from 'fs';
import {
  appConfigMissing,
} from '../prints';
import run, { exit } from '../utils/run';

/**
 * Checks appConfig exists
 *
 * @private
 */
export const _checkAppConfig = () => {
  if (!existsSync(getPaths().app.appConfig)) {
    appConfigMissing();

    return exit(1);
  }
};

/**
 * Runs pre-start/build checks
 */
const preScriptCheck = async (...args: string[]) => {
  logger.debug('Checking Flex plugin project directory');

  addCWDNodeModule(...args);

  _checkAppConfig();
};

run(preScriptCheck);

export default preScriptCheck;
