import { logger } from 'flex-dev-utils';
import { packagesVersions } from '../prints';

import run from '../utils/run';
import { getPackageDetails, LIST_OF_PACKAGES } from '../utils/package';

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
