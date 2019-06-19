import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';

const start = () => {
  logger.debug('Running dev-server');

  require(resolve('@craco/craco/scripts/start.js'));
};

start();
