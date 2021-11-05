import semver from 'semver';

import getRegistryVersion from './getRegistryVersion';

/**
 * Returns the latest flex ui version for a given major
 * Will search through latest, beta, and alpha versions for a matching verion (in that order)
 * @param version the flex ui major version
 */
export default async function getLatestFlexUIVersion(majorVersion: 1 | 2 | 3 | 4): Promise<string> {
  const tags = ['latest', 'beta', 'alpha'];
  for (const tag of tags) {
    // @ts-ignore
    const pkg = await getRegistryVersion('@twilio/flex-ui', tag);
    if (semver.coerce(pkg?.version as string)?.major === majorVersion) {
      // @ts-ignore
      return pkg.version;
    }
  }
  throw new Error(`The major version you requested for flex ui (${majorVersion}) does not exist.`);
}
