import {resolve, hijack} from '../utils/require';
import logger from '../utils/logger';

const build = () => {
  logger.debug('Running build');
  hijack('react-dev-utils/printHostingInstructions', () => {

  });

  require(resolve('@craco/craco/scripts/build.js'));
};

build();
