import { logger } from 'flex-dev-utils';
import { join } from 'path';
import { packagesVersions } from '../prints';

import { resolve } from '../utils/require';
import run from '../utils/run';

/* istanbul ignore next */
const LIST_OF_PACKAGES: string[] = [
  '@twilio/flex-ui',
  'flex-plugin-scripts',
  'flex-plugin',
  'flex-dev-utils',
  'craco-config-flex-plugin',
  '@craco/craco',
  'react-scripts',
  'react',
  'react-dom',
  'redux',
  'react-redux',
];

export interface PackageDetail {
  name: string;
  found: boolean;
  package: {
    name?: string;
    version?: string;
  };
}

/**
 * @param packages
 * @private
 */
/* istanbul ignore next */
export const _getPackageDetails = (packages: string[]): PackageDetail[] => {
  return packages
    .map((name) => {
      const detail: PackageDetail = {
        name,
        found: false,
        package: {},
      };

      try {
        const resolvedPath = resolve(join(name, 'package.json'));
        if (resolvedPath) {
          detail.package = require(resolvedPath);
          detail.found = true;
        }
      } catch (e) {
        detail.found = false;
      }

      return detail;
    });
};

/**
 * Prints the list of versions of important packages
 */
const info = async () => {
  logger.debug('Displaying information about the plugin');

  const details = _getPackageDetails(LIST_OF_PACKAGES);
  const found = details.filter((d) => d.found);
  const notFound = details.filter((d) => !d.found);

  packagesVersions(found, notFound);
};

run(info);

export default info;
