import semver from 'semver';

import getRegistryVersion from './getRegistryVersion';

const flexUI = '@twilio/flex-ui';

/**
 * Returns the latest flex ui version for a given major
 * Will search through latest, beta, and alpha versions for a matching verion (in that order)
 * @param version the flex ui major version
 */
export default async function getLatestFlexUIVersion(version: number): Promise<string> {
  const latest = await getRegistryVersion(flexUI, 'latest');
  const latestMajor = latest ? semver.coerce(latest.version as string)?.major : undefined;
  if (latestMajor && latestMajor >= version) {
    return latest.version as string;
  }

  const beta = await getRegistryVersion(flexUI, 'beta');
  const betaMajor = beta ? semver.coerce(beta.version as string)?.major : undefined;
  if (betaMajor && betaMajor >= version) {
    return beta.version as string;
  }

  const alpha = await getRegistryVersion(flexUI, 'alpha');
  const alphaMajor = alpha ? semver.coerce(alpha.version as string)?.major : undefined;
  if (alphaMajor && alphaMajor >= version) {
    return alpha.version as string;
  }

  throw new Error(`The major version you requested for flex ui (${version}) does not exist.`);
}
