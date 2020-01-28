import { resolve } from './require';
import { join } from 'path';

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
