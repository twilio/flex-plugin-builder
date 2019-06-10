import { resolve } from '../utils/require';
import logger from '../utils/logger';

const doTest = () => {
  logger.debug('Running tests');

  require(resolve('@craco/craco/scripts/test.js'));
};

doTest();
