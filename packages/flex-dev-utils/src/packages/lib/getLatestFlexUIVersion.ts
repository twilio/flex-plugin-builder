import semver from 'semver';

import getRegistryVersion, { Tag } from './getRegistryVersion';

/**
 * Returns the latest flex ui version for a given major
 * Will search through latest, beta, and alpha versions for a matching verion (in that order)
 * @param version the flex ui major version
 */
export default async function getLatestFlexUIVersion(majorVersion: 1 | 2 | 3 | 4): Promise<string> {
  const tags: Tag[] = ['latest', 'beta', 'alpha'];
  for (const tag of tags) {
    const pkg = await getRegistryVersion('@twilio/flex-ui', tag);
    if (!pkg || !pkg.version) {
      continue;
    }
    if (semver.coerce(pkg.version as string)?.major === majorVersion) {
      return pkg.version as string;
    }
  }

  throw new Error(`The major version you requested for flex ui (${majorVersion}) does not exist.`);
}
