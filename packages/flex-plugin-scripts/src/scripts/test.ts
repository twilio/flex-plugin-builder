import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';

const doTest = () => {
  logger.debug('Running tests');

  require(resolve('@craco/craco/scripts/test.js'));
};

doTest();
