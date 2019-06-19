import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';

const build = () => {
  logger.debug('Running build');

  // This prints a hosting instruction specific to react applications
  // We should replace it with instruction about Twilio Assets
  // hijack('react-dev-utils/printHostingInstructions', () => {
  //   // to be filled
  // });

  require(resolve('@craco/craco/scripts/build.js'));
};

build();
