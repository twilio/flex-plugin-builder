import {resolve} from '../utils/require';
import logger from '../utils/logger';

const start = () => {
  logger.debug('Running dev-server');

  require(resolve('@craco/craco/scripts/start.js'));
};

start();


