import { join } from 'path';

import { resolveModulePath } from '@twilio/flex-dev-utils/dist/fs';

export const FLEX_PACKAGES: string[] = [
  '@twilio/flex-ui',
  '@twilio/flex-plugin-scripts',
  '@twilio/flex-plugin',
  '@twilio/flex-dev-utils',
];

/* c8 ignore next */
export const LIST_OF_PACKAGES: string[] = [...FLEX_PACKAGES, 'react', 'react-dom', 'redux', 'react-redux'];

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
 */
/* c8 ignore next */
export const getPackageDetails = (packages: string[]): PackageDetail[] => {
  return packages.map((name) => {
    const detail: PackageDetail = {
      name,
      found: false,
      package: {},
    };

    try {
      const resolvedPath = resolveModulePath(join(name, 'package.json'));
      if (resolvedPath) {
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
        detail.package = require(resolvedPath);
        detail.found = true;
      }
    } catch (e) {
      detail.found = false;
    }

    return detail;
  });
};
