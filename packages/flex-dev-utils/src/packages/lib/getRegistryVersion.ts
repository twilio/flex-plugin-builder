import packageJson from 'package-json';

/**
 * Fetches the version corresponding to the dependency inside the flex-ui package.json
 * @param name the package to check
 */
export default async function getRegistryVersion(
  module: string,
  tag: 'latest' | 'alpha' | 'beta' = 'latest',
): Promise<packageJson.AbbreviatedMetadata> {
  return packageJson(module, { version: tag });
}
