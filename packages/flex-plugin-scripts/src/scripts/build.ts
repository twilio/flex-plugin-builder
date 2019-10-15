import { logger } from 'flex-dev-utils';

import { resolve } from '../utils/require';
import run from '../utils/run';

// The craco build.js script path
export const cracoScriptPath = '@craco/craco/scripts/build.js';

/**
 * Builds the bundle
 */
const build = () => {
  logger.debug('Running build');

  // This prints a hosting instruction specific to react applications
  // We should replace it with instruction about Twilio Assets
  // hijack('react-dev-utils/printHostingInstructions', () => {
  //   // to be filled
  // });

  require(cracoScriptPath);
};

run(build);

export default build;
