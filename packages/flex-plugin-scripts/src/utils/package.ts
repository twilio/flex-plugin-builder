import { resolve } from './require';
import { join } from 'path';

export const FLEX_PACKAGES: string[] = [
  '@twilio/flex-ui',
  'flex-plugin-scripts',
  'flex-plugin',
  'flex-dev-utils',
];

/* istanbul ignore next */
export const LIST_OF_PACKAGES: string[] = [
  ...FLEX_PACKAGES,
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
 */
/* istanbul ignore next */
export const getPackageDetails = (packages: string[]): PackageDetail[] => {
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
