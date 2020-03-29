import { logger } from 'flex-dev-utils';

import run, { exit } from '../utils/run';
import { getWebpack } from '../utils/package';

/**
 * Builds the bundle
 */
const build = async (...args: string[]) => {
  logger.debug('Building Flex plugin bundle');
  console.log(process.cwd());
  console.log(getWebpack())
};

run(build);

export default build;
