import { logger } from 'flex-dev-utils';
import { packagesVersions } from '../prints';

import run from '../utils/run';
import { getPackageDetails } from '../utils/package';

export const FLEX_PACKAGES: string[] = [
  '@twilio/flex-ui',
  'flex-plugin-scripts',
  'flex-plugin',
  'flex-dev-utils',
  'craco-config-flex-plugin',
];

/* istanbul ignore next */
const LIST_OF_PACKAGES: string[] = [
  ...FLEX_PACKAGES,
  '@craco/craco',
  'react-scripts',
  'react',
  'react-dom',
  'redux',
  'react-redux',
];

/**
 * Prints the list of versions of important packages
 */
const info = async () => {
  logger.debug('Displaying information about the plugin');

  const details = getPackageDetails(LIST_OF_PACKAGES);
  const found = details.filter((d) => d.found);
  const notFound = details.filter((d) => !d.found);

  packagesVersions(found, notFound);
};

run(info);

export default info;
