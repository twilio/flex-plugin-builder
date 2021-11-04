import semver from 'semver';

import getRegistryVersion from './getRegistryVersion';

export default async function getLatestFlexUIVersion(version: number): Promise<string> {
  const flexUI = '@twilio/flex-ui';
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
